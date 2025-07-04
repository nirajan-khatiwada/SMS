from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import AttandanceRecord
from .serializer import AttandanceRecordSerializer,DateSerializer,FromTo
from rest_framework.permissions import BasePermission
from student.models import StudentProfile
from django.db.models import Count
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
    
                    
class StundentAttandanceHistoryView(APIView):
    # permission_classes = [IsAuthenticated, IsTeacher]
    # authentication_classes = [JWTAuthentication]

    def get(self, request):
        from_to_serializer = FromTo(data=request.query_params)
        if from_to_serializer.is_valid():
            from_date = from_to_serializer.validated_data['from_date']
            to_date = from_to_serializer.validated_data['to_date']
            class_name = from_to_serializer.validated_data['class_name']
            section = from_to_serializer.validated_data['section']

            total_attandance_done = AttandanceRecord.objects.filter(date__gte=from_date,date__lte=to_date,class_name=class_name,section = section).values("date").distinct().count()

            students = StudentProfile.objects.filter(
                class_name=class_name,
                section=section
            )
            resp=[]
            for student in students:
                total_attandance = AttandanceRecord.objects.filter(
                    date__gte=from_date,  # Greater than or equal to from_date
                    date__lte=to_date,    # Less than or equal to to_date
                    class_name=class_name,
                    section=section,
                    student=student.id,
                    is_present=True
                ).aggregate(total =Count('id'))
                resp.append({
                    "student_id": student.id,
                    "first_name": student.user.first_name,
                    "last_name": student.user.last_name,
                    "roll_number": student.roll_number,
                    "total_present": total_attandance['total'] if total_attandance else 0,
                    "total_attendance": total_attandance_done
                })
            
            from_to_serializer = FromTo(resp, many=True)
            return Response(from_to_serializer.data, status=status.HTTP_200_OK)


        return Response(from_to_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            