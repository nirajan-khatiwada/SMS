from django.contrib import admin

# Register your models here.


from .models import Class, Section,Book

admin.site.register(Class)
admin.site.register(Section)
admin.site.register(Book)