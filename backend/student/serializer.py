from .models import Class, Section, StudentProfile
from rest_framework.serializers import ModelSerializer
from customuser.serializer import CustomUserSerializer
class classSerializer(ModelSerializer):
    class Meta:
        model = Class
        fields = ["id","name"]


class sectionSerializer(ModelSerializer):
    class Meta:
        model = Section
        fields = ["id","name"]

class StudentProfileSerializer(ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    class Meta:
        depth = 1
        model = StudentProfile
        fields = ["id", "user", "class_name", "section", "roll_number", "father_name", "mother_name"]
        read_only_fields = ["id", "user"]
    
class StudentPhoneNumberSerializer(ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ["id",]
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['phone_number'] = instance.user.username
        representation['first_name'] = instance.user.first_name
        representation['last_name'] = instance.user.last_name
        representation['class_name'] = instance.class_name.name if instance.class_name else None
        representation['section'] = instance.section.name if instance.section else None
        return representation
