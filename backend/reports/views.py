from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import CrimeReport, ReportStatus
from .serializers import (
    CrimeReportSerializer, 
    CrimeReportCreateSerializer,
    CrimeReportListSerializer,
    ReportStatusSerializer
)

class CrimeReportListCreateView(generics.ListCreateAPIView):
    serializer_class = CrimeReportListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'category', 'region', 'is_anonymous']
    search_fields = ['title', 'description', 'location_text']
    ordering_fields = ['created_at', 'updated_at', 'incident_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['authority', 'admin', 'moderator']:
            return CrimeReport.objects.all()
        else:
            # Citizens can only see their own reports
            return CrimeReport.objects.filter(
                Q(user=user) | Q(user__isnull=True, is_anonymous=True)
            )
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CrimeReportCreateSerializer
        return CrimeReportListSerializer

class CrimeReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CrimeReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['authority', 'admin', 'moderator']:
            return CrimeReport.objects.all()
        else:
            return CrimeReport.objects.filter(user=user)

class UserReportsView(generics.ListAPIView):
    serializer_class = CrimeReportListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'category']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return CrimeReport.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_report_status(request, report_id):
    try:
        report = CrimeReport.objects.get(id=report_id)
        
        # Check permissions
        if request.user.role not in ['authority', 'admin', 'moderator']:
            return Response(
                {'error': 'Permission refusée'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        new_status = request.data.get('status')
        comment = request.data.get('comment', '')
        
        if new_status not in dict(CrimeReport.STATUS_CHOICES):
            return Response(
                {'error': 'Statut invalide'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update report status
        report.status = new_status
        report.save()
        
        # Create status history entry
        ReportStatus.objects.create(
            report=report,
            status=new_status,
            comment=comment,
            updated_by=request.user
        )
        
        return Response({
            'message': 'Statut mis à jour avec succès',
            'report': CrimeReportSerializer(report).data
        })
        
    except CrimeReport.DoesNotExist:
        return Response(
            {'error': 'Signalement non trouvé'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def report_statistics(request):
    """Get general statistics about reports"""
    total_reports = CrimeReport.objects.count()
    resolved_reports = CrimeReport.objects.filter(status='resolved').count()
    in_progress_reports = CrimeReport.objects.filter(
        status__in=['reviewing', 'investigating']
    ).count()
    
    # Statistics by category
    from categories.models import CrimeCategory
    category_stats = []
    for category in CrimeCategory.objects.filter(is_active=True):
        count = CrimeReport.objects.filter(category=category).count()
        category_stats.append({
            'category': category.name_fr,
            'count': count
        })
    
    return Response({
        'total_reports': total_reports,
        'resolved_reports': resolved_reports,
        'in_progress_reports': in_progress_reports,
        'category_statistics': category_stats
    })
    