# Generated by Django 5.1.3 on 2024-11-27 00:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('translators', '0002_remove_languagecombination_texts_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='languagecombination',
            old_name='rate_per_hour',
            new_name='price_per_hour',
        ),
        migrations.RenameField(
            model_name='languagecombination',
            old_name='rate_per_word',
            new_name='price_per_word',
        ),
        migrations.RenameField(
            model_name='languagecombination',
            old_name='certified_rate',
            new_name='sworn_price_per_word',
        ),
    ]