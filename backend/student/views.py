from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializer import classSerializer, sectionSerializer
from .models import Class, Section
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializer import StudentProfileSerializer,StudentPhoneNumberSerializer
from .models import StudentProfile
# Create your views here.


class ClassView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self,request):
        classes = Class.objects.all().order_by("-id")
        serializer = classSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
   
class SectionView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        sections = Section.objects.all().order_by("-id")
        serializer = sectionSerializer(sections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
  

class AllStudentProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        student_profile = StudentProfile.objects.all()
        student_serializer = StudentProfileSerializer(student_profile, many=True)
        return Response(student_serializer.data, status=status.HTTP_200_OK)


class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        try:
            student_profile = StudentProfile.objects.get(pk=pk)
            student_serializer = StudentProfileSerializer(student_profile)
            return Response(student_serializer.data, status=status.HTTP_200_OK)
        except StudentProfile.DoesNotExist:
            return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
class StudentPhoneNumberView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        try:
            student_profile = StudentProfile.objects.all()
            serializer = StudentPhoneNumberSerializer(student_profile,many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except StudentProfile.DoesNotExist:
            return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
