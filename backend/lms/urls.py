from django.urls import path
from .views import ClassView,SectionView

urlpatterns = [
    path('classes/', ClassView.as_view(), name='class-list-create'),
    path('classes/<int:pk>/', ClassView.as_view(), name='class-detail-update-delete'),
    path('sections/', SectionView.as_view(), name='section-list-create'),
    path('sections/<int:pk>/', SectionView.as_view(), name='section-detail-update-delete'),
]
