from turtle import mode
from django.db import models

# Create your models here.

class Section(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name + str(self.id)

class Class(models.Model):
    name = models.CharField(max_length=100)
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

    