from os import write
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import  Book,BookIssue,BookReturn
from student.models import StudentProfile
        
class bookSerializer(ModelSerializer):
    sections = serializers.SerializerMethodField()
    classes = serializers.SerializerMethodField()
    issued_count = serializers.SerializerMethodField()
    def get_issued_count(self, obj):
        return BookIssue.objects.filter(book=obj,has_returned=False).count()

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
        fields = ["id", "book", "student", "issue_date", "return_date","has_returned"]
        read_only_fields = ["id", "issue_date"]
    def save(self, *args, **kwargs) :
        data = self.validated_data
        is_already_issued = BookIssue.objects.filter(
            book=data['book'],
            student=data['student'],
            has_returned=False
        ).exists()
        if is_already_issued:
            raise serializers.ValidationError("This book is already issued to this student.")
        if data['book'].quantity - BookIssue.objects.filter(book=data['book'],has_returned=False).count() <= 0:
            raise serializers.ValidationError("This book is not available for issue.")

        return super().save(*args, **kwargs)
    

class UserSerializer(ModelSerializer):
    class Meta:
        model = BookIssue.student.field.related_model.user.field.related_model
        fields = ["id", "first_name", "last_name"]
    

class studentSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        depth = 1
        model = BookIssue.student.field.related_model
        fields = ["id", "user", "class_name", "section"]


class GetBook(ModelSerializer):
    class Meta:
        model = Book
        depth = 1
        fields = ["id", "name", "author", "class_name", "section", "quantity", "created_at"]
        read_only_fields = ["id", "created_at"]
    


class GetBookIssueSerializer(ModelSerializer):

    student = studentSerializer(read_only=True)
    book = GetBook(read_only=True)

    class Meta:
        depth = 1
        model = BookIssue
        fields = ["id", "book", "student", "issue_date", "return_date"]
        



class BookReturnSerializer(ModelSerializer):
    
    class Meta:
        model = BookReturn
        fields = ["id", "book_issue", "return_date","note", "condition", "fine_amount"]
        read_only_fields = ["id"]

    def save(self, *args, **kwargs):
        data = self.validated_data
        book_issue = data['book_issue']
        
        if book_issue.has_returned:
            raise serializers.ValidationError("This book issue has already been returned.")
        
        # Update the book issue to mark it as returned
        book_issue.has_returned = True
        book_issue.save()

        return super().save(*args, **kwargs)


class GetBookReturnSerializer(ModelSerializer):
    book_issue = GetBookIssueSerializer(read_only=True)

    class Meta:
        model = BookReturn
        fields = ["id", "book_issue", "return_date", "note", "condition", "fine_amount"]
