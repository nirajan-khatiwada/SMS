from os import read
from rest_framework import serializers
from .models import AttandanceRecord,Assignment,AssignmentSubmission
from student.models import StudentProfile
from rest_framework.serializers import ModelSerializer
from .models import Class, Section
from .models import AssignmentSubmission
from datetime import datetime
from django.contrib.auth import get_user_model

User = get_user_model()


class AttandanceRecordSerializer(ModelSerializer):
    
    class Meta:
        model = AttandanceRecord
        fields = [
            "id",
            "teacher",
            "student",
            "class_name",
            "section",
            "date",
            "is_present"
        ]
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['student'] = {
            'id': instance.student.id,
            'first_name': instance.student.user.first_name,
            'last_name': instance.student.user.last_name,
            'roll_number': instance.student.roll_number,
            'class_name': instance.class_name.name if instance.class_name else None,
            'section': instance.section.name if instance.section else None,
            

        }
        return representation

class DateSerializer(serializers.Serializer):
    class_name = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all(),required=True)
    section = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all(),required=True)
    date = serializers.DateField(required=True)

class FromTo(serializers.Serializer):
    from_date = serializers.DateField(required=True,write_only=True)
    to_date = serializers.DateField(required=True,write_only=True)
    class_name = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all(), required=True,write_only=True)
    section = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all(), required=True,write_only=True)
    def validate(self, data):
        if data['from_date'] > data['to_date']:
            raise serializers.ValidationError("From date must be before to date.")
        
        return data
    
    def to_representation(self, instance):
        return {
            'student_id': instance['student_id'],
            'first_name': instance['first_name'],
            'last_name': instance['last_name'],
            'roll_number': instance['roll_number'],
            'total_attendance': instance['total_attendance'],
            'total_present': instance.get('total_present', 0)  # Optional field
        }
    

class AssignmentSerializer(ModelSerializer):
    submitted = serializers.SerializerMethodField()
    class Meta:
        model = Assignment
        fields = [
            "id",
            "title",
            "description",
            "due_date",
            "assigned_date",
            "class_name",
            "section",
            "teacher",
            "subject",
            "upload_file",
            "submitted",
        ]
    def get_submitted(self, obj):
        total_student = StudentProfile.objects.filter(
            class_name=obj.class_name,
            section=obj.section
        ).count()
        total_submissions = AssignmentSubmission.objects.filter(assignment=obj,status=True).count()
        return {
            'total_submissions': total_submissions,
            'total_students': total_student,
            'percentage': (total_submissions / total_student * 100) if total_student > 0 else 0
        }
    def to_representation(self, instance):
        representation= super().to_representation(instance)
        representation['class_name'] = instance.class_name.name if instance.class_name else None
        representation['section'] = instance.section.name if instance.section else None
        return representation
    

class AssignmentSubmissionSerializer(ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = [
            "id",
            "assignment",
            "student",
            "submitted_date",
            "grade",
            "feedback",
            "status"
        ]
        extra_kwargs = {
            'assignment': {'write_only': True},
        }
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['student'] = {
            'id': instance.student.id,
            'first_name': instance.student.user.first_name,
            'last_name': instance.student.user.last_name,
            'roll_number': instance.student.roll_number,
        }
        representation['assignment'] = {
            'id': instance.assignment.id,
            'title': instance.assignment.title,
            'due_date': instance.assignment.due_date,
            'class_name': instance.assignment.class_name.name if instance.assignment.class_name else None,
            'section': instance.assignment.section.name if instance.assignment.section else None,
        }
        return representation
    def update(self, instance, validated_data):
        instance.status=True
        instance.submitted_date = datetime.now().date()
        instance.save()
        return super().update(instance, validated_data)
    
 
class StudentSubmitionDetailSerializer(serializers.Serializer):

    section = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all(),
        required=True,
        write_only=True
    )
    class_name = serializers.PrimaryKeyRelatedField(
        queryset=Class.objects.all(),
        required=True,
        write_only=True
    )


class StudentAssignmentSummarySerializer(serializers.Serializer):
    """Serializer for showing student assignment summary with all assignments and submissions"""
    
    def to_representation(self, instance):
        try:
            # instance is a StudentProfile object
            class_name = self.context.get('class_name')
            section = self.context.get('section')
            teacher = self.context.get('teacher')
            
            # Validate that we have all required context
            if not all([class_name, section, teacher]):
                return {
                    'error': 'Missing required context parameters'
                }
            
            # Get all assignments for this class
            assignments = Assignment.objects.filter(
                class_name=class_name,
                section=section,
                teacher=teacher
            ).order_by('assigned_date')
            
            # Get all submissions for this student
            submissions = AssignmentSubmission.objects.filter(
                student=instance,
                assignment__class_name=class_name,
                assignment__section=section,
                assignment__teacher=teacher
            )
            
            # Create assignment details with submission status
            assignment_details = []
            for assignment in assignments:
                try:
                    submission = submissions.filter(assignment=assignment).first()
                    assignment_details.append({
                        'assignment_id': assignment.id,
                        'assignment_title': assignment.title,
                        'due_date': assignment.due_date,
                        'assigned_date': assignment.assigned_date,
                        'subject': assignment.subject,
                        'submission_status': submission.status if submission else False,
                        'submitted_date': submission.submitted_date if submission else None,
                        'grade': submission.grade if submission else None,
                        'feedback': submission.feedback if submission else None,
                    })
                except Exception as e:
                    # Log the error but continue processing other assignments
                    print(f"Error processing assignment {assignment.id}: {str(e)}")
                    continue
            
            # Safely get student information
            student_data = {
                'student_id': getattr(instance, 'id', None),
                'first_name': getattr(instance.user, 'first_name', '') if hasattr(instance, 'user') and instance.user else '',
                'last_name': getattr(instance.user, 'last_name', '') if hasattr(instance, 'user') and instance.user else '',
                'roll_number': getattr(instance, 'roll_number', ''),
                'total_assignments': assignments.count(),
                'submitted_assignments': submissions.filter(status=True).count(),
                'assignment_details': assignment_details
            }
            
            return student_data
            
        except Exception as e:
            # Return error information for debugging
            return {
                'error': f'Error processing student data: {str(e)}',
                'student_id': getattr(instance, 'id', None) if instance else None
            }