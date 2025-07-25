from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import bookSerializer,BookIssueSerializer, BookReturnSerializer,GetBookIssueSerializer,GetBookReturnSerializer,classSerializer,sectionSerializer
from .models import Book,BookIssue,BookReturn,Class,Section
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import BasePermission

class IsLibrarian(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "librarian" 

class BookView(APIView):
    permission_classes = [IsAuthenticated,IsLibrarian]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        books = Book.objects.all()
        serializer = bookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = bookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, pk):
        try:
            book_instance = Book.objects.get(pk=pk)
            book_instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)
    def patch(self, request, pk):
        try:
            book_instance = Book.objects.get(pk=pk)
            serializer = bookSerializer(book_instance, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)
        

class BookIssueView(APIView):
    permission_classes = [IsAuthenticated,IsLibrarian]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        book_issues = BookIssue.objects.filter(has_returned=False)
        serializer = GetBookIssueSerializer(book_issues, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = BookIssueSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class BookReturnView(APIView):
    permission_classes = [IsAuthenticated,IsLibrarian]
    authentication_classes = [JWTAuthentication]
    def post(self, request):
        serializer = BookReturnSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        book_issues = BookReturn.objects.all()
        serializer = GetBookReturnSerializer(book_issues, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ClassView(APIView):
    permission_classes = [IsAuthenticated,IsLibrarian]
    authentication_classes = [JWTAuthentication]
    def get(self,request):
        classes = Class.objects.all().order_by("-id")
        serializer = classSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self,request):
        serializer = classSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self,request,pk):
        try:
            class_instance = Class.objects.get(pk=pk)
            class_instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Class.DoesNotExist:
            return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self,request,pk):
        try:
            class_instance = Class.objects.get(pk=pk)
            serializer = classSerializer(class_instance, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Class.DoesNotExist:
            return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)
        
class SectionView(APIView):
    permission_classes = [IsAuthenticated,IsLibrarian]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        sections = Section.objects.all().order_by("-id")
        serializer = sectionSerializer(sections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = sectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        try:
            section_instance = Section.objects.get(pk=pk)
            section_instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Section.DoesNotExist:
            return Response({"error": "Section not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, pk):
        try:
            section_instance = Section.objects.get(pk=pk)
            serializer = sectionSerializer(section_instance, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Section.DoesNotExist:
            return Response({"error": "Section not found"}, status=status.HTTP_404_NOT_FOUND)
        