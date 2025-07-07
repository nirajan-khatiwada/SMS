from rest_framework import serializers
from .models import AttandanceRecord,Assignment,AssignmentSubmission
from student.models import StudentProfile
from rest_framework.serializers import ModelSerializer
from .models import Class, Section
from .models import AssignmentSubmission
from datetime import datetime
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
    
 

        




        
    