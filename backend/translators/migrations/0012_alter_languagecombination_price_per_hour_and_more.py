# Generated by Django 5.1.3 on 2024-12-02 22:04

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('translators', '0011_alter_professionalprofile_native_languages'),
    ]

    operations = [
        migrations.AlterField(
            model_name='languagecombination',
            name='price_per_hour',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True, verbose_name='Precio/hora (€)'),
        ),
        migrations.AlterField(
            model_name='languagecombination',
            name='price_per_word',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True, verbose_name='Precio/pal. (€)'),
        ),
        migrations.AlterField(
            model_name='languagecombination',
            name='sworn_price_per_word',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True, verbose_name='Precio/pal. Jurada (€)'),
        ),
        migrations.AlterField(
            model_name='professionalprofile',
            name='employment_status',
            field=models.CharField(choices=[('Autonomo', 'Autonomo'), ('Traductor ocasional', 'Traductor ocasional'), ('Estudiante', 'Estudiante'), ('Agencia', 'Agencia'), ('Otros', 'Otros')], max_length=20, null=True, verbose_name='Situación Laboral'),
        ),
        migrations.CreateModel(
            name='Curriculum',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cv_file', models.FileField(upload_to='curriculums/', verbose_name='Currículum Vitae')),
                ('voice_note', models.FileField(blank=True, null=True, upload_to='voice_notes/', verbose_name='Nota de Voz')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Subida')),
                ('translator', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='curriculum', to=settings.AUTH_USER_MODEL, verbose_name='Traductor')),
            ],
        ),
    ]
