from calendar import c
from pyexpat import model
from rest_framework.serializers import ModelSerializer
from .models import Class, Section

class classSerializer(ModelSerializer):
    class Meta:
        model = Class
        fields = ["id","name"]


class sectionSerializer(ModelSerializer):
    class Meta:
        model = Section
        fields = ["id","name"]
        