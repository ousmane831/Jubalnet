from rest_framework import serializers
from .models import Complaint, ComplaintAttachment, ComplaintMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class ComplaintAttachmentSerializer(serializers.ModelSerializer):
    file_name = serializers.SerializerMethodField()

    class Meta:
        model = ComplaintAttachment
        fields = ["id", "file", "file_name", "uploaded_at"]

    def get_file_name(self, obj):
        return obj.file.name.split("/")[-1] if obj.file else None


class ComplaintMessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    sender_name = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    is_current_user = serializers.SerializerMethodField()

    class Meta:
        model = ComplaintMessage
        fields = ["id", "complaint", "sender", "sender_name", "is_admin", "is_current_user", "message", "created_at", "read"]
        read_only_fields = ["sender", "created_at"]

    def get_sender(self, obj):
        return {
            "id": obj.sender.id if obj.sender else None,
            "username": obj.sender.username if obj.sender else None,
            "email": obj.sender.email if obj.sender else None,
        }

    def get_sender_name(self, obj):
        if obj.sender:
            return obj.sender.get_full_name() or obj.sender.username
        return "Utilisateur inconnu"

    def get_is_admin(self, obj):
        return obj.sender.is_staff or obj.sender.is_superuser if obj.sender else False

    def get_is_current_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.sender.id == request.user.id
        return False

    def create(self, validated_data):
        # L'expéditeur est automatiquement l'utilisateur connecté
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


class ComplaintSerializer(serializers.ModelSerializer):
    submitted_by = serializers.SerializerMethodField()
    attachments = ComplaintAttachmentSerializer(many=True, read_only=True)
    messages = serializers.SerializerMethodField()
    unread_messages_count = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = "__all__"

    def get_submitted_by(self, obj):
        return {
            "id": obj.submitted_by.id if obj.submitted_by else None,
            "username": obj.submitted_by.username if obj.submitted_by else None,
            "email": obj.submitted_by.email if obj.submitted_by else None,
        }

    def get_messages(self, obj):
        """Récupère les messages de manière sécurisée"""
        try:
            # Vérifier si le modèle ComplaintMessage existe
            if hasattr(obj, 'messages'):
                messages = obj.messages.all().order_by('created_at')
                return ComplaintMessageSerializer(messages, many=True, context=self.context).data
        except Exception as e:
            # Si erreur (modèle pas migré, etc.), retourner liste vide
            print(f"Erreur lors de la récupération des messages: {e}")
        return []

    def get_unread_messages_count(self, obj):
        """Compte les messages non lus de manière sécurisée"""
        try:
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                # Vérifier si le modèle ComplaintMessage existe
                if hasattr(obj, 'messages'):
                    # Compter les messages non lus pour l'utilisateur actuel
                    if request.user.is_staff or request.user.is_superuser:
                        # Admin voit les messages non lus de l'utilisateur
                        return obj.messages.filter(read=False, sender=obj.submitted_by).count()
                    else:
                        # Utilisateur voit les messages non lus de l'admin
                        from django.contrib.auth import get_user_model
                        User = get_user_model()
                        admin_users = User.objects.filter(is_staff=True)
                        return obj.messages.filter(read=False, sender__in=admin_users).count()
        except Exception as e:
            # Si erreur (modèle pas migré, etc.), retourner 0
            print(f"Erreur lors du comptage des messages non lus: {e}")
        return 0
