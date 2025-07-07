from django.db import models
from django.contrib.auth import get_user_model
from student.models import StudentProfile
from twilio.rest import Client
from student.models import Class, Section
from django.db.models.signals import post_save
from django.dispatch import receiver
from nepali.datetime import nepalidate
from decouple import config


# Create your models here.
User = get_user_model()

class AttandanceRecord(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendance_records')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='attendance_records')
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='attendance_records')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    is_present = models.BooleanField(default=False)  # True for present, False for absent
    def __str__(self):
        return f"{self.student.user.first_name} {self.student.user.last_name} - {self.date} - {'Present' if self.is_present else 'Absent'}"
    
@receiver(post_save, sender=AttandanceRecord)
def send_sms_notification(sender, instance, created, **kwargs):
    if created and not instance.is_present:
        
        # Your Twilio credentials (get them from https://www.twilio.com/console)
        account_sid = config('TWILLIO_ACCOUNT_SID')
        auth_token = config('TWILLIO_AUTH_TOKEN')
        
        client = Client(account_sid, auth_token)

        nepali_date = nepalidate.from_date(instance.date)

        try:
            # Send SMS notification
            message = client.messages.create(
                body=f'🚀 तपाईंको बच्चा {instance.student.user.first_name} {instance.student.user.last_name} आज {nepali_date} मा अनुपस्थित छैन। कृपया कारण बताउनुहोस्!',
                from_=config("TWILLIO_PHONE_NUMBER"),  # Your Twilio phone number
                to=f'+977{instance.student.user.username}'  # The recipient's phone number
            )
            print(f"SMS sent successfully. Message SID: {message.sid}")
            
        except Exception as e:
            print(f"Failed to send SMS: {str(e)}")
            # You might want to log this error to a file or database
  

      



class Assignment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateField()
    assigned_date = models.DateField(auto_now_add=True)
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='assignments')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='assignments')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments')
    upload_file = models.FileField(upload_to='assignments/', blank=True, null=True)  # Optional field for file upload
    subject = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.title} - {self.class_name.name} {self.section.name} ({self.due_date})"

@receiver(post_save, sender=Assignment)
def create_assignment_submission(sender, instance, created, **kwargs):
    if created:
        # Automatically create an assignment submission for each student in the class
        students = StudentProfile.objects.filter(class_name=instance.class_name, section=instance.section)
        for student in students:
            AssignmentSubmission.objects.create(assignment=instance, student=student)

class AssignmentSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='submissions')
    submitted_date = models.DateField(null=True, blank=True)  # Date when the assignment was submitted
    grade = models.CharField(max_length=10, blank=True, null=True)  # Optional field for grading
    feedback = models.TextField(blank=True, null=True)  # Optional field for teacher feedback
    status = models.BooleanField(default=False)  # True if submitted, False if not submitted
    def __str__(self):
        return f"{self.assignment.title} - {self.student.user.first_name} {self.student.user.last_name} ({'Submitted' if self.status else 'Not Submitted'})"