from django.contrib import admin

# Register your models here.


from .models import Book,BookIssue,BookReturn,Class,Section

admin.site.register(Book)
admin.site.register(BookReturn)

admin.site.register(BookIssue)
admin.site.register(Class)
admin.site.register(Section)