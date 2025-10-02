from rest_framework import serializers
from .models import Complaint, ComplaintAttachment
from django.contrib.auth import get_user_model

User = get_user_model()

class ComplaintAttachmentSerializer(serializers.ModelSerializer):
    file_name = serializers.SerializerMethodField()

    class Meta:
        model = ComplaintAttachment
        fields = ["id", "file", "file_name", "uploaded_at"]

    def get_file_name(self, obj):
        return obj.file.name.split("/")[-1] if obj.file else None


class ComplaintSerializer(serializers.ModelSerializer):
    submitted_by = serializers.SerializerMethodField()
    attachments = ComplaintAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Complaint
        fields = "__all__"

    def get_submitted_by(self, obj):
        return {
            "id": obj.submitted_by.id if obj.submitted_by else None,
            "username": obj.submitted_by.username if obj.submitted_by else None,
            "email": obj.submitted_by.email if obj.submitted_by else None,
        }
