from rest_framework.response import Response
from rest_framework.views import APIView
from .serializer import ContactFormSerializer
from rest_framework.throttling import AnonRateThrottle


# Create your views here.
class ContactFormView(APIView):
    throttle_classes = [AnonRateThrottle]  
    def post(self,request):
        serializer = ContactFormSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Contact form submitted successfully!"}, status=201)
        return Response(serializer.errors, status=400)
