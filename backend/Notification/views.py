from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializer import NotificationSerializer
from .models import Notification

class NotificationView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        notifications = Notification.objects.filter(recipients=request.user,sender__role='principal').order_by("-id")
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=200)
