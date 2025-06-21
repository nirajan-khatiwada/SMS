from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import ScopedRateThrottle
from .serializer import LoginSerializer
from rest_framework.status import HTTP_401_UNAUTHORIZED,HTTP_200_OK



class LoginView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'user_login'
    def post(self,request):
        login = LoginSerializer(data=request.data,context={'request': request})
        if login.is_valid():
            user = login.save()
            refresh = RefreshToken.for_user(user)
            refresh['username'] = user.username
            refresh['role'] = user.role
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=HTTP_200_OK)
        else:
            return Response(login.errors, status=HTTP_401_UNAUTHORIZED)
            
 
