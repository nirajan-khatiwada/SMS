from pyexpat import model
from turtle import mode
from django.db import models
from student.models import Class, Section
from student.models import StudentProfile
# Create your models here.


    
class Book(models.Model):
    name = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='books')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='books')
    quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    def __str__(self):
        return f"{self.name} by {self.author} ({self.class_name.name} - {self.section.name})"
    
class BookIssue(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='issues')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='book_issues')
    issue_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"Issue of {self.book.name} to {self.student.user.username}"

    