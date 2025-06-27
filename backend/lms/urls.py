from django.urls import path
from .views import BookView,BookIssueView

urlpatterns = [
    path('books/', BookView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookView.as_view(), name='book-detail-update-delete'),
    path('book-issues/', BookIssueView.as_view(), name='book-issue-list-create'),
]
