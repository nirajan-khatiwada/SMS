from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializer import CustomUserSerializer,PasswordSerializer




class CustomUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        user_serializer = CustomUserSerializer(user) 
        return Response(user_serializer.data, status=200)
    def put(self, request):
        user= request.user
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    
class ChangePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        serializer = PasswordSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password changed successfully."}, status=200)
        return Response(serializer.errors, status=400)