from django.urls import path
from .views import AttendanceView,StundentAttandanceHistoryView,AssignmentView,AssignmentSubmissionView
urlpatterns = [
    path('attandance/',AttendanceView.as_view(), name='attandance-list-create'),
    path('student-attandance-history/', StundentAttandanceHistoryView.as_view(), name='attandance-history'),
    path('assignments/', AssignmentView.as_view(), name='assignment-list'),
    path('assignments/<int:pk>/', AssignmentView.as_view(), name='update-delete-assignment'),
    path('assignment-submissions/<int:pk>/', AssignmentSubmissionView.as_view(), name='assignment-submission-list'),
    path('assignment-submission/<int:pk>/', AssignmentSubmissionView.as_view(), name='update-assignment-submission'),

]
