from rest_framework.serializers import ModelSerializer
from .models import CustomUser  # Adjust the import path as necessary
from rest_framework import serializers
class CustomUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser  # Adjust the model path as necessary
        fields = ['id', 'role','username', 'email', 'first_name', 'last_name','picture']
        read_only_fields = ['id']  # ID is read-only and auto-generated
        def update(self, instance, validated_data):
            instance.first_name = validated_data.get('first_name', instance.first_name)
            instance.last_name = validated_data.get('last_name', instance.last_name)
            instance.email = validated_data.get('email', instance.email)
            instance.save()
            return instance
            
class PasswordSerializer(ModelSerializer):
    change_password = serializers.CharField(write_only=True, required=True,min_length=8)
    class Meta:
        model = CustomUser
        fields = ['password', 'change_password']
    

    def update(self, instance, validated_data):
        change_password = validated_data.get('change_password')
        password = validated_data.get('password')
        if instance.check_password(password):
            instance.set_password(change_password)
            instance.save()
            return instance
        else:
            raise serializers.ValidationError("Current password is incorrect.")
