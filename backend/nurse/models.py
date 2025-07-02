from django.db import models
from student.models import StudentProfile
# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    stock = models.PositiveIntegerField()
    def __str__(self):
        return self.name


HEALTH_CONDITION = (
    ("Critical", "Critical"),
    ("Serious", "Serious"),
    ("Stable", "Stable"),
    ("Recovered", "Recovered"),
    ("Deceased", "Deceased"),
    ("Normal","Normal")
)


class Record(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='nurse_records')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='nurse_records')  # Medicine, bandage, etc. (optional)
    quantity = models.PositiveIntegerField(default=1)

    visit_reason = models.CharField(max_length=100)  # Example: Headache, Stomach pain, Injury
    health_condition = models.CharField(max_length=50, choices=HEALTH_CONDITION, default="Normal")  # General condition status

    treatment_given = models.TextField(blank=True, null=True)  # Example: Gave paracetamol, Applied bandage
    parent_contacted = models.BooleanField(default=False)  # If parents were called/informed
    referred_to_doctor = models.BooleanField(default=False)  # If student was advised to see a doctor

    date = models.DateTimeField(auto_now_add=True)  # When visit was recorded
    note = models.TextField(blank=True, null=True)  # Extra notes if needed (optional)

    def __str__(self):
        return f"{self.student} - {self.visit_reason} - {self.date.date()}"
    
