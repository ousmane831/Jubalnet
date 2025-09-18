from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('user__username', 'user__email', 'title', 'message')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    actions = ['mark_as_read', 'mark_as_unread']

    # Action pour marquer plusieurs notifications comme lues
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f"{updated} notification(s) marquée(s) comme lue(s).")
    mark_as_read.short_description = "Marquer comme lue"

    # Action pour marquer plusieurs notifications comme non lues
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f"{updated} notification(s) marquée(s) comme non lue(s).")
    mark_as_unread.short_description = "Marquer comme non lue"
