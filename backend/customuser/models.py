from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager
# Create your models here.


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


class CustomUserManager(BaseUserManager):
    def create_user(self, username,role, password=None,**extra_fields):
        if not username:
            raise ValueError("The Username field must be set")
        if not role:
            raise ValueError("The Role field must be set")
        
        user = self.model(username=username,role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self,role,username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username,role, password, **extra_fields)


class CustomUser(AbstractBaseUser,PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True,null=True, blank=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    role = models.CharField(max_length=20, choices=ROLES, default="student")
    picture = models.ImageField(upload_to='profile_pics/', default='profile_pics/default.jpg')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ["role"]

    def __str__(self):
        return self.username
