from email import message
from turtle import mode
from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User=get_user_model()

choices = (
    ('Normal', 'Normal'),
    ('Urgent', 'Urgent'),
    ('Info', 'Info'),
)

class Notification(models.Model):
    documents = models.FileField(upload_to='notices/%Y/%m/%d/', max_length=100,blank=True, null=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    recipients = models.ManyToManyField(User, related_name='received_notifications')
    subject=models.CharField(max_length=100)
    date =models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=choices, default='Normal')
    message = models.TextField(blank=True, null=True,)

    def __str__(self):
        return f"Notification from {self.sender.username} to {', '.join([user.username for user in self.recipients.all()])} - {self.subject}"

    