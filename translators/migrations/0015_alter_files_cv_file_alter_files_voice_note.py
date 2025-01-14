# Generated by Django 5.1.3 on 2024-12-03 23:25

import translators.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('translators', '0014_alter_files_cv_file_alter_files_voice_note'),
    ]

    operations = [
        migrations.AlterField(
            model_name='files',
            name='cv_file',
            field=models.FileField(upload_to=translators.models.cv_upload_path, verbose_name='Currículum Vitae'),
        ),
        migrations.AlterField(
            model_name='files',
            name='voice_note',
            field=models.FileField(blank=True, null=True, upload_to=translators.models.voice_note_upload_path, verbose_name='Nota de Voz'),
        ),
    ]
