from django.urls import path
from .views import BookView,BookIssueView,BookReturnView,ClassView,SectionView

urlpatterns = [
    path('books/', BookView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookView.as_view(), name='book-detail-update-delete'),
    path('book-issues/', BookIssueView.as_view(), name='book-issue-list-create'),
    path('book-return/', BookReturnView.as_view(), name='book-return-list-create'),
    path('classes/', ClassView.as_view(), name='class-list-create'),
    path('classes/<int:pk>/', ClassView.as_view(), name='class-detail-update-delete'),
    path('sections/', SectionView.as_view(), name='section-list-create'),
    path('sections/<int:pk>/', SectionView.as_view(), name='section-detail-update-delete'),
]
