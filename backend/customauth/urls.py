from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView,TokenBlacklistView,TokenObtainPairView
from .views import LoginView
urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('login/', LoginView.as_view(), name='login'),
        
]
