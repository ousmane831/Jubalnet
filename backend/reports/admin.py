from django.contrib import admin
from .models import CrimeReport, ReportMedia, VoiceReport, ReportStatus

# Inline pour gérer les médias directement dans le rapport
class ReportMediaInline(admin.TabularInline):
    model = ReportMedia
    extra = 1
    readonly_fields = ('file_name', 'file_size', 'mime_type', 'created_at')
    fields = ('media_type', 'file', 'file_name', 'file_size', 'mime_type', 'transcription', 'created_at')
    can_delete = True

# Inline pour gérer le voice report directement dans le rapport
class VoiceReportInline(admin.StackedInline):
    model = VoiceReport
    extra = 0
    readonly_fields = ('duration_seconds', 'transcription_fr', 'transcription_wo', 'transcription_confidence', 'is_processed', 'created_at')
    fields = ('audio_file', 'duration_seconds', 'transcription_fr', 'transcription_wo', 'transcription_confidence', 'is_processed', 'created_at')
    can_delete = False

# Inline pour l'historique des statuts
class ReportStatusInline(admin.TabularInline):
    model = ReportStatus
    extra = 0
    readonly_fields = ('status', 'comment', 'updated_by', 'created_at')
    fields = ('status', 'comment', 'updated_by', 'created_at')
    can_delete = False
    ordering = ('-created_at',)

@admin.register(CrimeReport)
class CrimeReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'user', 'status', 'priority', 'is_anonymous', 'contact_allowed', 'created_at')
    list_filter = ('status', 'priority', 'is_anonymous', 'contact_allowed', 'category', 'created_at')
    search_fields = ('title', 'description', 'other_crime_specification', 'location_text', 'region', 'department', 'commune')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    inlines = [ReportMediaInline, VoiceReportInline, ReportStatusInline]

@admin.register(ReportMedia)
class ReportMediaAdmin(admin.ModelAdmin):
    list_display = ('report', 'file_name', 'media_type', 'file_size', 'mime_type', 'created_at')
    list_filter = ('media_type',)
    search_fields = ('file_name', 'mime_type', 'report__title')
    readonly_fields = ('file_name', 'file_size', 'mime_type', 'created_at')
    ordering = ('-created_at',)

@admin.register(VoiceReport)
class VoiceReportAdmin(admin.ModelAdmin):
    list_display = ('report', 'duration_seconds', 'is_processed', 'created_at')
    readonly_fields = ('duration_seconds', 'transcription_fr', 'transcription_wo', 'transcription_confidence', 'is_processed', 'created_at')
    ordering = ('-created_at',)

@admin.register(ReportStatus)
class ReportStatusAdmin(admin.ModelAdmin):
    list_display = ('report', 'status', 'updated_by', 'created_at')
    list_filter = ('status',)
    search_fields = ('report__title', 'updated_by__email', 'comment')
    readonly_fields = ('status', 'comment', 'updated_by', 'created_at')
    ordering = ('-created_at',)
