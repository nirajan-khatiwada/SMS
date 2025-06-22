from pyexpat import model
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ModelSerializer
from .models import Notification



class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'documents', 'sender', 'recipients', 'subject', 'date', 'status',"message"]
        read_only_fields = ['id', 'date']  # Make id and date read-only
      

