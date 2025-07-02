from rest_framework.serializers import ModelSerializer
from .models import Product
from student.models import StudentProfile
from django.contrib.auth import get_user_model
USER = get_user_model()
from .models import Record
class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = ["id","name","description","stock"]


    
