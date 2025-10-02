from django.urls import path
from . import views

urlpatterns = [
    path('', views.CrimeReportListCreateView.as_view(), name='report_list_create'),
    path('<int:pk>/', views.CrimeReportDetailView.as_view(), name='report_detail'),
    path('my-reports/', views.UserReportsView.as_view(), name='user_reports'),
    path('<int:report_id>/update-status/', views.update_report_status, name='update_report_status'),
    path('statistics/', views.report_statistics, name='report_statistics'),
    path("statistics/regions/", views.CrimeByRegionAPIView.as_view(), name="crime-by-region"),
]