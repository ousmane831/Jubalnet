from rest_framework.routers import DefaultRouter
from .views import ComplaintViewSet, ComplaintMessageViewSet

router = DefaultRouter()
router.register(r'', ComplaintViewSet, basename='complaints')  # <-- vide pour éviter le double /complaints/
router.register(r'messages', ComplaintMessageViewSet, basename='complaint-messages')
urlpatterns = router.urls
