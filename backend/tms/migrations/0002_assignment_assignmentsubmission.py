# Generated by Django 5.2.3 on 2025-07-06 06:33

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0001_initial'),
        ('tms', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('due_date', models.DateField()),
                ('assigned_date', models.DateField(auto_now_add=True)),
                ('upload_file', models.FileField(blank=True, null=True, upload_to='assignments/')),
                ('subject', models.CharField(max_length=100)),
                ('class_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='student.class')),
                ('section', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='student.section')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AssignmentSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('submitted_date', models.DateField(auto_now_add=True)),
                ('grade', models.CharField(blank=True, max_length=10, null=True)),
                ('feedback', models.TextField(blank=True, null=True)),
                ('assignment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='submissions', to='tms.assignment')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='submissions', to='student.studentprofile')),
            ],
        ),
    ]
