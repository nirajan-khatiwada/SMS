from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import AttandanceRecord
from .serializer import AttandanceRecordSerializer,DateSerializer
from rest_framework.permissions import BasePermission
# Create your views here.
class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "teacher"  # Assuming 'role' is a field in your user model

class AttendanceView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        date_serializer = DateSerializer(data=request.query_params)
        if date_serializer.is_valid():
            class_name = date_serializer.validated_data.get('class_name')
            section = date_serializer.validated_data.get('section')
            date = date_serializer.validated_data.get('date')

            attendance_records = AttandanceRecord.objects.filter(
                class_name=class_name,
                section=section,
                date=date
            ).order_by('-id')

            serializer = AttandanceRecordSerializer(attendance_records, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(date_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer = AttandanceRecordSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
                    
