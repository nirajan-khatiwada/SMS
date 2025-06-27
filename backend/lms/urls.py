from django.urls import path
from .views import ClassView,SectionView,BookView

urlpatterns = [
    path('classes/', ClassView.as_view(), name='class-list-create'),
    path('classes/<int:pk>/', ClassView.as_view(), name='class-detail-update-delete'),
    path('sections/', SectionView.as_view(), name='section-list-create'),
    path('sections/<int:pk>/', SectionView.as_view(), name='section-detail-update-delete'),
    path('books/', BookView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookView.as_view(), name='book-detail-update-delete'),
]
