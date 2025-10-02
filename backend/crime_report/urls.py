from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/complaints/', include('Complaint.urls')),
    path('api/categories/', include('categories.urls')),
    path('api/notifications/', include('notifications.urls')),
    
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)