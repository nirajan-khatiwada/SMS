from django.urls import path
from .views import CustomUserView

urlpatterns = [
    path('', CustomUserView.as_view(), name='custom_user'),
]