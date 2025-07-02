
from .models import Product
# Create your views here.
from .serializer import ProductSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import PostRecordSerializer,GetRecordSerializer
from .models import Record
from rest_framework.permissions import IsAuthenticated,BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication

class IsNurse(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "nurse" 


class ProductView(APIView):
    authentication_classes= [JWTAuthentication]
    permission_classes = [IsAuthenticated,IsNurse]
    def get(self,request):
        product = Product.objects.all().order_by("-id")
        product_serializer = ProductSerializer(product,many=True)
        return Response(product_serializer.data,status=status.HTTP_200_OK)
    def post(self,request):
        product_serializer = ProductSerializer(data=request.data)
        if product_serializer.is_valid():
            product_serializer.save()
            return Response(product_serializer.data,status=status.HTTP_201_CREATED)
        return Response(product_serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def put(self,request,pk):
        try:
            product = Product.objects.get(pk=pk)
            product_ser = ProductSerializer(data = request.data,instance =product)
            if product_ser.is_valid():
                product_ser.save()
                return Response(product_ser.data,status=status.HTTP_200_OK)
            else:
                return Response(product_ser.errors,status=status.HTTP_400_BAD_REQUEST)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    def delete(self,request,pk):
        try:
            product = Product.objects.get(pk=pk)
            product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        
class RecordView(APIView):
    permission_classes = [IsAuthenticated,IsNurse]
    authentication_classes = [JWTAuthentication]
    def get(self,request):
        record = Record.objects.all().order_by("-id")
        record_serializer = GetRecordSerializer(record,many=True)
        return Response(record_serializer.data,status= status.HTTP_200_OK)
    def post(self,request):
        record_ser = PostRecordSerializer(data=request.data)
        if record_ser.is_valid():
            record_ser.save()
            return Response(record_ser.data,status=status.HTTP_201_CREATED)
        return Response(record_ser.errors,status=status.HTTP_400_BAD_REQUEST)
    def put(self,request,pk):
        try:
            record = Record.objects.get(pk=pk)
            record_ser= PostRecordSerializer(record)
            return Response(record_ser.data,status = status.HTTP_200_OK)
        except Record.DoesNotExist:
            return Response({
                "erorr":"Record Doesnot Found"
            },status=status.HTTP_404_NOT_FOUND)
    def delete(self,request,pk):
        try:
            record = Record.objects.get(pk=pk)
            record.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Record.DoesNotExist:
            return Response({
                "error":"Record doesnot found"
            },
            status=status.HTTP_404_NOT_FOUND
            )
            

