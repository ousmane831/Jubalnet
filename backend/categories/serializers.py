from rest_framework import serializers
from .models import CrimeCategory

class CrimeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CrimeCategory
        fields = '__all__'