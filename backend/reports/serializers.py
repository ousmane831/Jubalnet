from rest_framework import serializers
from .models import CrimeReport, ReportMedia, VoiceReport, ReportStatus
from categories.serializers import CrimeCategorySerializer
from accounts.serializers import UserSerializer
from datetime import date
from categories.models import CrimeCategory


# ----------- Media ----------- #
class ReportMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportMedia
        fields = '__all__'


class VoiceReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoiceReport
        fields = '__all__'


class ReportStatusSerializer(serializers.ModelSerializer):
    updated_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ReportStatus
        fields = '__all__'


# ----------- Lecture d'un report ----------- #
class CrimeReportSerializer(serializers.ModelSerializer):
    category = CrimeCategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    user = UserSerializer(read_only=True)
    media_files = ReportMediaSerializer(many=True, read_only=True)
    voice_report = VoiceReportSerializer(read_only=True)
    status_history = ReportStatusSerializer(many=True, read_only=True)
    
    class Meta:
        model = CrimeReport
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and not request.user.is_anonymous:
            validated_data['user'] = request.user
        return super().create(validated_data)


# ----------- Création d'un report ----------- #
class CrimeReportCreateSerializer(serializers.ModelSerializer):
    files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    audio_file = serializers.FileField(write_only=True, required=False)
    
    class Meta:
        model = CrimeReport
        fields = [
            'category', 'title', 'description', 'other_crime_specification',
            'location_text', 'latitude', 'longitude', 'region', 'department', 'commune',
            'incident_date', 'incident_time', 'priority', 'is_anonymous', 'contact_allowed',
            'language', 'files', 'audio_file'
        ]
        extra_kwargs = {
            'title': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
            'incident_date': {'required': False, 'allow_null': True},
            'category': {'required': False, 'allow_null': True},
        }

    def validate(self, attrs):
        # Vérifier que l’utilisateur envoie soit un texte, soit un audio
        if not attrs.get('title') and not attrs.get('description') and not attrs.get('audio_file'):
            raise serializers.ValidationError(
                "Un signalement doit contenir soit un titre/description, soit un fichier audio."
            )
        return attrs
    
    def create(self, validated_data):
        files = validated_data.pop('files', [])
        audio_file = validated_data.pop('audio_file', None)

        # Valeurs par défaut si report vocal
        if audio_file:
            if not validated_data.get('title'):
                validated_data['title'] = "Signalement vocal"
            if not validated_data.get('incident_date'):
                validated_data['incident_date'] = date.today()
            if not validated_data.get('category'):
                validated_data['category'] = CrimeCategory.objects.first()

        request = self.context.get('request')
        if request and not request.user.is_anonymous:
            validated_data['user'] = request.user
        
        report = CrimeReport.objects.create(**validated_data)
        
        # Gérer les fichiers
        for file in files:
            ReportMedia.objects.create(
                report=report,
                media_type=self._get_media_type(file.content_type),
                file=file,
                file_name=file.name,
                file_size=file.size,
                mime_type=file.content_type
            )
        
        # Gérer l'audio
        if audio_file:
            VoiceReport.objects.create(
                report=report,
                audio_file=audio_file,
                duration_seconds=0  # calculable plus tard
            )
        
        return report
    
    def _get_media_type(self, content_type):
        if content_type.startswith('image/'):
            return 'image'
        elif content_type.startswith('video/'):
            return 'video'
        elif content_type.startswith('audio/'):
            return 'audio'
        else:
            return 'document'


# ----------- Liste des reports ----------- #
class CrimeReportListSerializer(serializers.ModelSerializer):
    category = CrimeCategorySerializer(read_only=True)
    user = UserSerializer(read_only=True)
    media_files = ReportMediaSerializer(many=True, read_only=True)
    voice_report = VoiceReportSerializer(read_only=True)

    class Meta:
        model = CrimeReport
        fields = [
            'id', 'title', 'description', 'category', 'user', 'status', 'priority',
            'is_anonymous', 'region', 'incident_date', 'created_at', 'updated_at',
            'latitude', 'longitude', 'voice_report', 'media_files'
        ]
