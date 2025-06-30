from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import bookSerializer,BookIssueSerializer, BookReturnSerializer,GetBookIssueSerializer,GetBookReturnSerializer
from .models import Book,BookIssue,BookReturn
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