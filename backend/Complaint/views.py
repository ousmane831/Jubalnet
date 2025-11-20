from rest_framework import viewsets, permissions, parsers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Complaint, ComplaintAttachment
from .serializers import ComplaintSerializer, ComplaintMessageSerializer

# Import conditionnel de ComplaintMessage pour éviter les erreurs si la table n'existe pas
try:
    from .models import ComplaintMessage
except Exception:
    ComplaintMessage = None

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all().order_by('-complaint_date')
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_queryset(self):
        """
        Les utilisateurs ne voient que leurs propres plaintes
        Les admins (is_staff, is_superuser ou role='admin') voient toutes les plaintes
        """
        import logging
        logger = logging.getLogger('Complaint.views')
        
        user = self.request.user
        logger.debug("=== DEBUT get_queryset ===")
        logger.debug(f"Utilisateur: {user} (ID: {user.id})")
        logger.debug(f"is_staff: {user.is_staff}, is_superuser: {user.is_superuser}, role: {getattr(user, 'role', 'non défini')}")
        
        if not user.is_authenticated:
            logger.error("ERREUR: Utilisateur non authentifié")
            return Complaint.objects.none()
        
        # Récupération de base des plaintes
        queryset = Complaint.objects.all()
        logger.debug(f"Requête de base: {str(queryset.query)}")
        logger.debug(f"Nombre total de plaintes: {queryset.count()}")
        
        # Vérification des permissions
        is_admin = user.is_staff or user.is_superuser or getattr(user, 'role', None) == 'admin'
        
        if is_admin:
            logger.debug("Mode administrateur: accès à toutes les plaintes")
            result = queryset.order_by('-complaint_date')
        else:
            logger.debug(f"Mode utilisateur: filtrage pour {user.username}")
            result = queryset.filter(submitted_by=user).order_by('-complaint_date')
        
        # Log des requêtes SQL générées
        logger.debug(f"Requête finale: {str(result.query)}")
        logger.debug(f"Nombre de plaintes après filtrage: {result.count()}")
        
        # Log des premières plaintes (max 5)
        for i, complaint in enumerate(result[:5]):
            logger.debug(f"Plainte {i+1}: ID={complaint.id}, Date={complaint.complaint_date}, Par={complaint.submitted_by_id if complaint.submitted_by else 'None'}")
        
        logger.debug("=== FIN get_queryset ===")
        return result

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        # Assigne automatiquement l'utilisateur connecté
        complaint = serializer.save(submitted_by=self.request.user)

        # ✅ Gérer les fichiers envoyés
        files = self.request.FILES.getlist("attachments")
        for f in files:
            ComplaintAttachment.objects.create(complaint=complaint, file=f)

    @action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        """
        Vue pour récupérer et créer des messages pour une plainte
        GET: Récupère tous les messages de la plainte
        POST: Crée un nouveau message
        """
        complaint = self.get_object()
        user = request.user

        # Vérifier les permissions : admin, staff, superuser ou le plaignant peuvent accéder
        is_admin = user.is_staff or user.is_superuser or getattr(user, 'role', None) == 'admin'
        if not (is_admin or complaint.submitted_by == user):
            return Response(
                {"detail": "Vous n'avez pas la permission d'accéder à ces messages."},
                status=status.HTTP_403_FORBIDDEN
            )

        if request.method == 'GET':
            try:
                # Essayer d'accéder aux messages - si la table n'existe pas, retourner liste vide
                if hasattr(complaint, 'messages'):
                    try:
                        messages = complaint.messages.all().order_by('created_at')
                        serializer = ComplaintMessageSerializer(messages, many=True, context={'request': request})
                        return Response(serializer.data)
                    except Exception:
                        # Si erreur (table n'existe pas), retourner liste vide
                        return Response([], status=status.HTTP_200_OK)
                else:
                    return Response([], status=status.HTTP_200_OK)
            except Exception:
                # Toute autre erreur, retourner liste vide
                return Response([], status=status.HTTP_200_OK)

        elif request.method == 'POST':
            try:
                print("DEBUG: user =", request.user)
                print("DEBUG: complaint =", complaint)
                print("DEBUG: request.data =", request.data)

                serializer = ComplaintMessageSerializer(
                    data=request.data,
                    context={'request': request}
                )
                if serializer.is_valid():
                    msg = serializer.save(complaint=complaint)
                    print("DEBUG: message created =", msg)
                    print("Serializer valid, saved message:", serializer.data)  # Confirme la sauvegarde
                    return Response(serializer.data, status=status.HTTP_201_CREATED)

                print("Serializer errors:", serializer.errors)  # Affiche les erreurs si invalides
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print("Exception during POST messages:", e)  # Affiche toute exception inattendue
                error_msg = str(e)
                if 'does not exist' in error_msg.lower() or 'no such table' in error_msg.lower():
                    return Response(
                        {"detail": "Le système de messagerie n'est pas encore disponible. Veuillez appliquer les migrations avec: python manage.py migrate Complaint"},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
                return Response(
                    {"detail": f"Erreur lors de la création du message: {error_msg}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )



    @action(detail=True, methods=['post'])
    def mark_messages_read(self, request, pk=None):
        """
        Marque tous les messages non lus d'une plainte comme lus
        """
        complaint = self.get_object()
        user = request.user

        # Vérifier les permissions
        is_admin = user.is_staff or user.is_superuser or getattr(user, 'role', None) == 'admin'
        if not (is_admin or complaint.submitted_by == user):
            return Response(
                {"detail": "Vous n'avez pas la permission d'effectuer cette action."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Marquer les messages comme lus
        try:
            is_admin = user.is_staff or user.is_superuser or getattr(user, 'role', None) == 'admin'
            if is_admin:
                # Admin marque les messages de l'utilisateur comme lus
                updated = complaint.messages.filter(
                    read=False,
                    sender=complaint.submitted_by
                ).update(read=True)
            else:
                # Utilisateur marque les messages de l'admin comme lus
                from django.contrib.auth import get_user_model
                User = get_user_model()
                admin_users = User.objects.filter(Q(is_staff=True) | Q(is_superuser=True) | Q(role='admin'))
                updated = complaint.messages.filter(
                    read=False,
                    sender__in=admin_users
                ).update(read=True)
        except Exception:
            # Si erreur (table n'existe pas), retourner 0
            updated = 0

        return Response({
            "detail": f"{updated} message(s) marqué(s) comme lu(s).",
            "updated_count": updated
        })


class ComplaintMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les messages de plaintes
    """
    serializer_class = ComplaintMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Les utilisateurs ne voient que les messages de leurs plaintes
        Les admins voient tous les messages
        """
        if ComplaintMessage is None:
            # Si le modèle n'existe pas encore, retourner queryset vide
            from django.db import models
            class EmptyQuerySet(models.QuerySet):
                def __init__(self):
                    super().__init__(None, None)
            return EmptyQuerySet()
        
        user = self.request.user
        complaint_id = self.request.query_params.get('complaint', None)

        # Vérifier si l'utilisateur est admin, staff ou superuser
        is_admin = user.is_staff or user.is_superuser or getattr(user, 'role', None) == 'admin'
        
        if is_admin:
            queryset = ComplaintMessage.objects.all()
        else:
            # Utilisateur ne voit que les messages de ses plaintes
            queryset = ComplaintMessage.objects.filter(
                complaint__submitted_by=user
            )

        if complaint_id:
            queryset = queryset.filter(complaint_id=complaint_id)

        return queryset.order_by('created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        complaint_id = self.request.data.get('complaint')
        if not complaint_id:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"complaint": "Ce champ est requis."})

        try:
            complaint = Complaint.objects.get(pk=complaint_id)
        except Complaint.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("Plainte introuvable.")

        # Vérifier les permissions
        user = self.request.user
        is_admin = user.is_staff or user.is_superuser or getattr(user, 'role', None) == 'admin'
        if not (is_admin or complaint.submitted_by == user):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Vous n'avez pas la permission d'envoyer un message pour cette plainte.")

        serializer.save(complaint=complaint)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """
        Marque un message comme lu
        """
        message = self.get_object()
        user = request.user

        # Vérifier les permissions
        complaint = message.complaint
        is_admin = user.is_staff or user.is_superuser or getattr(user, 'role', None) == 'admin'
        if not (is_admin or complaint.submitted_by == user):
            return Response(
                {"detail": "Vous n'avez pas la permission d'effectuer cette action."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            message.read = True
            message.save()
            return Response({"detail": "Message marqué comme lu."})
        except Exception as e:
            return Response(
                {"detail": f"Erreur: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
