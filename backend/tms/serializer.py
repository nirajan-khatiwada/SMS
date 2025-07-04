from os import write
from rest_framework import serializers
from .models import AttandanceRecord
from rest_framework.serializers import ModelSerializer
from .models import Class, Section

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
    