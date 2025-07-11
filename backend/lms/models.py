
from django.db import models

from student.models import StudentProfile
# Create your models here.




class Section(models.Model):
    name = models.CharField(max_length=100,unique=True)
    def __str__(self):
        return self.name 

class Class(models.Model):
    name = models.CharField(max_length=100,unique=True)
    def __str__(self):
        return f"{self.name}"
    
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
    has_returned = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.id}.Issue of {self.book.name} to {self.student.user.username} "
    
class BookReturn(models.Model):
    fine_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    book_issue = models.ForeignKey(BookIssue, on_delete=models.CASCADE, related_name='returns')
    return_date = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True, null=True)
    condition =models.CharField(max_length=50,null=True,blank=True)
    def __str__(self):
        return f"Return of {self.book_issue.book.name} by {self.book_issue.student.user.username}"
    