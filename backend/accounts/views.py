from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from .models import User, EmergencyContact
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserSerializer,
    EmergencyContactSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Inscription réussie'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Connexion réussie'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except:
        pass
    logout(request)
    return Response({'message': 'Déconnexion réussie'})

import uuid

@api_view(['POST'])
@permission_classes([AllowAny])
def anonymous_login(request):
    try:
        # Générer un username unique
        unique_id = uuid.uuid4().hex[:8]
        username = f'anonymous_{unique_id}'
        email = f'{username}@example.com'  
        language = request.data.get('language', 'fr')

        # Créer l'utilisateur anonyme
        anonymous_user = User.objects.create(
            username=username,
            email=email,
            is_anonymous=True,
            preferred_language=language,
            role='citizen',
        )
        anonymous_user.set_unusable_password()
        anonymous_user.save()

        # Générer un token
        token, _ = Token.objects.get_or_create(user=anonymous_user)

        return Response({
            'user': UserSerializer(anonymous_user).data,
            'token': token.key,
            'message': 'Session anonyme créée'
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': f'Impossible de créer un utilisateur anonyme: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return Response(UserSerializer(request.user).data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmergencyContactListView(generics.ListAPIView):
    queryset = EmergencyContact.objects.filter(is_active=True)
    serializer_class = EmergencyContactSerializer
    permission_classes = [AllowAny]