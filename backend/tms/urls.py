from django.urls import path
from .views import AttendanceView,StundentAttandanceHistoryView
urlpatterns = [
    path('attandance/',AttendanceView.as_view(), name='attandance-list-create'),
    path('student-attandance-history/', StundentAttandanceHistoryView.as_view(), name='attandance-history'),
]
