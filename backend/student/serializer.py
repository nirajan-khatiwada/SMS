
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
    