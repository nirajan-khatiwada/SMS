from django.db import models
from django.contrib.auth import get_user_model
from student.models import StudentProfile
from student.models import Class, Section

# Create your models here.
User = get_user_model()

class AttandanceRecord(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendance_records')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='attendance_records')
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='attendance_records')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    is_present = models.BooleanField(default=False)  # True for present, False for absent



