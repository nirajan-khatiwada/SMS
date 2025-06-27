from django.contrib import admin
from .models import StudentProfile, Class, Section
# Register your models here.
admin.site.register(StudentProfile)
admin.site.register(Class)
admin.site.register(Section)