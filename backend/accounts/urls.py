from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('anonymous-login/', views.anonymous_login, name='anonymous_login'),
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('emergency-contacts/', views.EmergencyContactListView.as_view(), name='emergency_contacts'),
]