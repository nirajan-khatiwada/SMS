from django.contrib import admin

# Register your models here.


from .models import Class, Section

admin.site.register(Class)
admin.site.register(Section)