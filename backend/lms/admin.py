from django.contrib import admin

# Register your models here.


from .models import Book,BookIssue,BookReturn

admin.site.register(Book)
admin.site.register(BookReturn)

admin.site.register(BookIssue)