from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework import status
class UnauthorizedException(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'Unauthorized access.'
    default_code = 'unauthorized'


ROLES = (
    ("principal", "Principal"),
    ("hod", "HOD"),
    ("teacher", "Teacher"),
    ("student", "Student"),
    ("librarian", "Librarian"),
    ("attender", "Attender"),
    ("nurse", "Nurse"),  # Instead of "hospital"
    ("doctor", "Doctor"),
    ("health_staff", "Health Staff"),
    ("parent", "Parent"),  # Optional but useful for student mgmt
)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, required=True)
    password = serializers.CharField(write_only=True, required=True)
    role= serializers.ChoiceField(choices=ROLES, required=True)
    def save(self):
        request = self.context.get('request')
        username = self.validated_data.get('username')
        password = self.validated_data.get('password')
        role = self.validated_data.get('role')
       
        user = authenticate(request=request, username=username, password=password)
     
        if user is not None:
            print(f"Authenticated user: {user.username} with role: {user.role}")
            if user.role != role:
                raise UnauthorizedException("Role mismatch")
            return user
        else:
            raise UnauthorizedException("Invalid username or password")
            