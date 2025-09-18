from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import CrimeCategory
from .serializers import CrimeCategorySerializer

class CrimeCategoryListView(generics.ListAPIView):
    queryset = CrimeCategory.objects.filter(is_active=True)
    serializer_class = CrimeCategorySerializer
    permission_classes = [AllowAny]

class CrimeCategoryDetailView(generics.RetrieveAPIView):
    queryset = CrimeCategory.objects.filter(is_active=True)
    serializer_class = CrimeCategorySerializer
    permission_classes = [AllowAny]