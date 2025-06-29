from django.urls import path
from .views import BookView,BookIssueView,BookReturnView

urlpatterns = [
    path('books/', BookView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookView.as_view(), name='book-detail-update-delete'),
    path('book-issues/', BookIssueView.as_view(), name='book-issue-list-create'),
    path('book-return/', BookReturnView.as_view(), name='book-return-list-create'),
]
