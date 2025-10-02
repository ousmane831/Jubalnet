from rest_framework import viewsets, permissions, parsers
from .models import Complaint, ComplaintAttachment
from .serializers import ComplaintSerializer

class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all().order_by('-complaint_date')
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        # Assigne automatiquement l'utilisateur connecté
        complaint = serializer.save(submitted_by=self.request.user)

        # ✅ Gérer les fichiers envoyés
        files = self.request.FILES.getlist("attachments")
        for f in files:
            ComplaintAttachment.objects.create(complaint=complaint, file=f)
