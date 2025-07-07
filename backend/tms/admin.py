from django.contrib import admin

# Register your models here.
from .models import AttandanceRecord,Assignment,AssignmentSubmission
admin.site.register(AttandanceRecord)
admin.site.register(Assignment)
admin.site.register(AssignmentSubmission)