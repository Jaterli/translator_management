# Generated by Django 5.1.4 on 2025-01-15 20:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('queries', '0003_rename_sqlquery_savedquery'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savedquery',
            name='name',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='savedquery',
            name='query',
            field=models.JSONField(),
        ),
    ]
