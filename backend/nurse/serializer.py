from rest_framework.serializers import ModelSerializer
from .models import Product
from django.contrib.auth import get_user_model
from student.models import StudentProfile
USER = get_user_model()
from .models import Record
class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = ["id","name","description","stock"]


class PostRecordSerializer(ModelSerializer):
    class Meta:
        model = Record
        fields = ["id","student","product","quantity","visit_reason","health_condition","treatment_given","parent_contacted","referred_to_doctor","note"]
    
    def create(self, validated_data):
        product = validated_data.get('product')
        quantity = validated_data.get('quantity')
        if product.stock < quantity:
            raise ValueError("Insufficient stock for the product")
        product.stock -= quantity
        product.save()
        return super().create(validated_data)
  

        

    

    
class GetUser(ModelSerializer):
    class Meta:
        model = USER
        fields = ["first_name","last_name"]



class GetStudentProfile(ModelSerializer):
    user = GetUser(read_only = True)
    class Meta:
        depth=1
        model =StudentProfile
        fields = ["id","user","class_name","section"]



class GetRecordSerializer(ModelSerializer):
    student = GetStudentProfile(read_only = True)
    product = ProductSerializer(read_only = True)

    class Meta:
        model=Record
        fields = ["id","student","product","quantity","visit_reason","health_condition","treatment_given","parent_contacted","referred_to_doctor","note","date"]
        


