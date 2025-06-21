from .models import ContactForm
from rest_framework import serializers

class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields = ['id', 'name', 'email', 'message']
        read_only_fields = ['id']  # ID is read-only and auto-generated