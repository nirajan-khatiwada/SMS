from django.urls import path
from .views import ProductView

urlpatterns = [
    path("product/", ProductView.as_view(), name="product-list"),
    path("product/<int:pk>/", ProductView.as_view(), name="product-detail"),
]