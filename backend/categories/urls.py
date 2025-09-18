from django.urls import path
from . import views

urlpatterns = [
    path('', views.CrimeCategoryListView.as_view(), name='category_list'),
    path('<int:pk>/', views.CrimeCategoryDetailView.as_view(), name='category_detail'),
]