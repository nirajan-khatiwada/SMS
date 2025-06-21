from .views import ContactFormView
from django.urls import path

urlpatterns = [
    path('', ContactFormView.as_view(), name='contact_form'),
]