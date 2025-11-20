# Generated manually for ComplaintMessage model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Complaint', '0002_remove_complaint_attachments_complaintattachment'),
    ]

    operations = [
        migrations.CreateModel(
            name='ComplaintMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField(verbose_name='Message')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Date de création')),
                ('read', models.BooleanField(default=False, verbose_name='Lu')),
                ('complaint', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='Complaint.complaint', verbose_name='Plainte')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Expéditeur')),
            ],
            options={
                'verbose_name': 'Message de plainte',
                'verbose_name_plural': 'Messages de plaintes',
                'ordering': ['created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='complaintmessage',
            index=models.Index(fields=['complaint', 'created_at'], name='Complaint_c_complai_idx'),
        ),
        migrations.AddIndex(
            model_name='complaintmessage',
            index=models.Index(fields=['complaint', 'read'], name='Complaint_c_complai_read_idx'),
        ),
    ]


