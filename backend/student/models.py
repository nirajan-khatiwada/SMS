from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.
USER = get_user_model()


class Section(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name 

class Class(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return f"{self.name}"


class StudentProfile(models.Model):
    user = models.OneToOneField(USER, on_delete=models.CASCADE, related_name='student_profile')
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='students')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='students')
    roll_number = models.CharField(max_length=20, unique=True)
    father_name = models.CharField(max_length=100,blank=True, null=True)
    mother_name = models.CharField(max_length=100,null=True, blank=True)
    def __str__(self):
        return f"{self.user.username} - {self.class_name.name} - {self.section.name} - {self.roll_number}"