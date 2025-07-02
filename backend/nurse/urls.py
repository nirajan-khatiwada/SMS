from django.urls import path
from .views import ProductView,RecordView

urlpatterns = [
    path("product/", ProductView.as_view(), name="product-list"),
    path("product/<int:pk>/", ProductView.as_view(), name="product-detail"),
    path("record/",RecordView.as_view(),name="record-get-post"),
    path("record/<int:pk>/",RecordView.as_view(),name= "record-put-delete")
]