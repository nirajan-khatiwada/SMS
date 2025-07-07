from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import AttandanceRecord,AssignmentSubmission
from .serializer import AttandanceRecordSerializer,DateSerializer,FromTo,AssignmentSerializer,AssignmentSubmissionSerializer,StudentSubmitionDetailSerializer,StudentAssignmentSummarySerializer
from rest_framework.permissions import BasePermission
from student.models import StudentProfile
from django.db.models import Count
from .models import Assignment
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
    permission_classes = [IsAuthenticated, IsTeacher]
    authentication_classes = [JWTAuthentication]

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




class AssignmentView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]
    authentication_classes = [JWTAuthentication,IsTeacher]
    def get(self, request):
        assignments = Assignment.objects.filter(teacher=request.user).order_by('-assigned_date')
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, pk):
        try:
            assignment = Assignment.objects.get(pk=pk, teacher=request.user)
        except Assignment.DoesNotExist:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignmentSerializer(assignment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        try:
            assignment = Assignment.objects.get(pk=pk, teacher=request.user)
        except Assignment.DoesNotExist:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)

        assignment.delete()
        return Response({"message": "Assignment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)





class AssignmentSubmissionView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication,IsTeacher]

    def get(self, request,pk):
        assignment_submissions = AssignmentSubmission.objects.filter(assignment__id=pk).order_by('-submitted_date')
        serializer = AssignmentSubmissionSerializer(assignment_submissions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk):
        try:
            assignment_submission = AssignmentSubmission.objects.get(pk=pk)
        except AssignmentSubmission.DoesNotExist:
            return Response({"error": "Assignment submission not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignmentSubmissionSerializer(assignment_submission, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class AssignmentSubmissionCreateView(APIView):
    """
    API endpoint to get assignment submission details for a class and section.
    
    Query Parameters:
    - class_name: ID of the class
    - section: ID of the section  
    - teacher: ID of the teacher
    
    Returns:
    - class_name: Name of the class
    - section: Name of the section
    - total_assignments: Total number of assignments created for this class
    - total_students: Total number of students in the class
    - students: Array of student objects with their assignment details
        - Each student object contains:
            - student_id, first_name, last_name, roll_number
            - total_assignments: Total assignments for this student
            - submitted_assignments: Number of assignments submitted by student
            - assignment_details: Array of all assignments with submission status
    """
    permission_classes = [IsAuthenticated, IsTeacher]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            student_submission_serializer = StudentSubmitionDetailSerializer(data=request.query_params)
            if student_submission_serializer.is_valid():
                class_name = student_submission_serializer.validated_data['class_name']
                section = student_submission_serializer.validated_data['section']
                teacher = request.user  # Assuming the teacher is the authenticated user
                
                # Get all students in the class and section
                students = StudentProfile.objects.filter(
                    class_name=class_name,
                    section=section,
                    user__role='student'
                ).select_related('user').order_by('roll_number')
                
                # Get total assignments for this class and section
                total_assignments = Assignment.objects.filter(
                    class_name=class_name,
                    section=section,
                    teacher=teacher
                ).count()
                
                # Serialize each student with their assignment summary
                serializer = StudentAssignmentSummarySerializer(
                    students, 
                    many=True,
                    context={
                        'class_name': class_name,
                        'section': section,
                        'teacher': teacher
                    }
                )
                
                response_data = {
                    'class_name': class_name.name if hasattr(class_name, 'name') else str(class_name),
                    'section': section.name if hasattr(section, 'name') else str(section),
                    'total_assignments': total_assignments,
                    'total_students': students.count(),
                    'students': serializer.data
                }
                
                return Response(response_data, status=status.HTTP_200_OK)
            return Response(student_submission_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({
                'error': 'An error occurred while processing the request',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

