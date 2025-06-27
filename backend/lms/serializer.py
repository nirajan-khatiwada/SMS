from os import write
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Class, Section, Book

class classSerializer(ModelSerializer):
    class Meta:
        model = Class
        fields = ["id","name"]


class sectionSerializer(ModelSerializer):
    class Meta:
        model = Section
        fields = ["id","name"]
        
class bookSerializer(ModelSerializer):

    sections = serializers.SerializerMethodField()
    classes = serializers.SerializerMethodField()

    def get_sections(self, obj):
        return obj.section.name if obj.section else None
    
    def get_classes(self, obj):
        return obj.class_name.name if obj.class_name else None

    class Meta:
        model = Book
        fields = ["id","classes","sections","name","author","class_name","section","quantity","created_at"]
