import stat
from django.shortcuts import render
from .models import Product
# Create your views here.
from .serializer import ProductSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ProductView(APIView):
    def get(self,request):
        product = Product.objects.all()
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