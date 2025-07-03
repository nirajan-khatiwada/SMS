from django.urls import path
from .views import ClassView,SectionView,AllStudentProfileView,StudentPhoneNumberView

urlpatterns = [
    path('classes/', ClassView.as_view(), name='class-list-create'),
    path('sections/', SectionView.as_view(), name='section-list-create'),
    path('all-student-profile/', AllStudentProfileView.as_view(), name='student-profile'),
    path('student-phone-number/', StudentPhoneNumberView.as_view(), name='student-phone-number'),

]
    