from django.contrib import admin

# Register your models here.


from .models import Book,BookIssue

admin.site.register(Book)
admin.site.register(BookIssue)