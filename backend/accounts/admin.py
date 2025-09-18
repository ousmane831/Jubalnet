from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Authority, EmergencyContact

# ----------------------------
# Admin pour le modèle User
# ----------------------------
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('username', 'full_name', 'email', 'role', 'is_active', 'preferred_language', 'date_joined')
    list_filter = ('role', 'is_active', 'preferred_language', 'is_staff', 'is_superuser')
    search_fields = ('username', 'full_name', 'email', 'phone')
    ordering = ('date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informations personnelles', {'fields': ('full_name', 'email', 'phone', 'preferred_language')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'full_name', 'email', 'phone', 'role', 'preferred_language', 'password1', 'password2', 'is_active')}
        ),
    )

# ----------------------------
# Admin pour le modèle Authority
# ----------------------------
class AuthorityAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'jurisdiction_region', 'jurisdiction_department', 'badge_number', 'is_active', 'created_at')
    list_filter = ('department', 'is_active')
    search_fields = ('user__username', 'user__full_name', 'badge_number', 'jurisdiction_region', 'jurisdiction_department')
    ordering = ('user__full_name',)

# ----------------------------
# Admin pour le modèle EmergencyContact
# ----------------------------
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ('name_fr', 'name_wo', 'phone_number', 'department', 'is_active', 'sort_order')
    list_filter = ('department', 'is_active')
    search_fields = ('name_fr', 'name_wo', 'phone_number', 'department')
    ordering = ('sort_order', 'name_fr')

# ----------------------------
# Enregistrement des modèles
# ----------------------------
admin.site.register(User, UserAdmin)
admin.site.register(Authority, AuthorityAdmin)
admin.site.register(EmergencyContact, EmergencyContactAdmin)
