# Generated by Django 5.1.4 on 2025-01-13 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('queries', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SQLQuery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('query', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.DeleteModel(
            name='SavedQuery',
        ),
    ]
