# Generated by Django 5.1.3 on 2024-11-27 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('translators', '0004_alter_languagecombination_services_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='professionalprofile',
            name='degree',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Titulo'),
        ),
        migrations.AlterField(
            model_name='professionalprofile',
            name='native_languages',
            field=models.CharField(blank=True, choices=[('Alemán', 'Alemán'), ('Árabe', 'Árabe'), ('Bosnio', 'Bosnio'), ('Búlgaro', 'Búlgaro'), ('Catalán', 'Catalán'), ('Checo', 'Checo'), ('Chino', 'Chino'), ('Coreano', 'Coreano'), ('Croata', 'Croata'), ('Danés', 'Danés'), ('Eslovaco', 'Eslovaco'), ('Esloveno', 'Esloveno'), ('Español', 'Español'), ('Español (MX)', 'Español (MX)'), ('Euskera', 'Euskera'), ('Filipino', 'Filipino'), ('Finés', 'Finés'), ('Francés', 'Francés'), ('Francés (CA)', 'Francés (CA)'), ('Gallego', 'Gallego'), ('Georgiano', 'Georgiano'), ('Griego', 'Griego'), ('Hebreo', 'Hebreo'), ('Hindi', 'Hindi'), ('Holandés', 'Holandés'), ('Húngaro', 'Húngaro'), ('Inglés', 'Inglés'), ('Islandés', 'Islandés'), ('Italiano', 'Italiano'), ('Japonés', 'Japonés'), ('Lituano', 'Lituano'), ('Noruego', 'Noruego'), ('Polaco', 'Polaco'), ('Portugués (BR)', 'Portugués (BR)'), ('Portugués (PT)', 'Portugués (PT)'), ('Rumano', 'Rumano'), ('Ruso', 'Ruso'), ('Serbio', 'Serbio'), ('Singalés', 'Singalés'), ('Sueco', 'Sueco'), ('Tailandés', 'Tailandés'), ('Turco', 'Turco'), ('Ucraniano', 'Ucraniano'), ('Urdu', 'Urdu'), ('Valenciano', 'Valenciano'), ('Vietnamita', 'Vietnamita')], max_length=20, null=True, verbose_name='Lenguas Nativas'),
        ),
    ]
