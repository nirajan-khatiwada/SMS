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