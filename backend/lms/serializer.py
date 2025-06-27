from os import write
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import  Book,BookIssue

        
class bookSerializer(ModelSerializer):

    sections = serializers.SerializerMethodField()
    classes = serializers.SerializerMethodField()
    issued_count = serializers.SerializerMethodField()
    def get_issued_count(self, obj):
        return BookIssue.objects.filter(book=obj).count()

    def get_sections(self, obj):
        return obj.section.name if obj.section else None
    
    def get_classes(self, obj):
        return obj.class_name.name if obj.class_name else None

    class Meta:
        model = Book
        fields = ["id","classes","sections","name","author","class_name","section","quantity","created_at","issued_count"]


class BookIssueSerializer(ModelSerializer):
    class Meta:
        model = BookIssue
        fields = ["id", "book", "student", "issue_date", "return_date"]
        read_only_fields = ["id", "issue_date"]
    def save(self, *args, **kwargs) :
        data = self.validated_data
        is_already_issued = BookIssue.objects.filter(
            book=data['book'],
            student=data['student'],
        ).exists()
        if is_already_issued:
            raise serializers.ValidationError("This book is already issued to this student.")
        if data['book'].quantity - BookIssue.objects.filter(book=data['book']).count() <= 0:
            raise serializers.ValidationError("This book is not available for issue.")

        return super().save(*args, **kwargs)

