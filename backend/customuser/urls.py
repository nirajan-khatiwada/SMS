from django.urls import path
from .views import CustomUserView,ChangePasswordView

urlpatterns = [
    path('', CustomUserView.as_view(), name='custom_user'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]