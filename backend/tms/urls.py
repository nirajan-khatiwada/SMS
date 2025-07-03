from django.urls import path
from .views import AttendanceView
urlpatterns = [
    path('attandance/',AttendanceView.as_view(), name='attandance-list-create'),
]
