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
    
    path('users/', views.list_users, name='list_users'),
    path('users/<int:user_id>/update-role/', views.update_user_role, name='update_user_role'),
    path('users/<int:user_id>/update-department/', views.update_user_department, name='update_user_department'),
]