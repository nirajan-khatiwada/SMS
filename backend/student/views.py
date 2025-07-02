from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializer import classSerializer, sectionSerializer
from .models import Class, Section
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializer import StudentProfileSerializer
from .models import StudentProfile
# Create your views here.


class ClassView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self,request):
        classes = Class.objects.all().order_by("-id")
        serializer = classSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self,request):
        serializer = classSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self,request,pk):
        try:
            class_instance = Class.objects.get(pk=pk)
            class_instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Class.DoesNotExist:
            return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self,request,pk):
        try:
            class_instance = Class.objects.get(pk=pk)
            serializer = classSerializer(class_instance, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Class.DoesNotExist:
            return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)
        
class SectionView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        sections = Section.objects.all().order_by("-id")
        serializer = sectionSerializer(sections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = sectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        try:
            section_instance = Section.objects.get(pk=pk)
            section_instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Section.DoesNotExist:
            return Response({"error": "Section not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, pk):
        try:
            section_instance = Section.objects.get(pk=pk)
            serializer = sectionSerializer(section_instance, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Section.DoesNotExist:
            return Response({"error": "Section not found"}, status=status.HTTP_404_NOT_FOUND)
        

class AllStudentProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        student_profile = StudentProfile.objects.all()
        student_serializer = StudentProfileSerializer(student_profile, many=True)
        return Response(student_serializer.data, status=status.HTTP_200_OK)
    
