# Generated by Django 5.1.3 on 2024-11-28 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('translators', '0006_alter_professionalprofile_experience'),
    ]

    operations = [
        migrations.AlterField(
            model_name='professionalprofile',
            name='native_languages',
            field=models.CharField(blank=True, choices=[('Alemán', 'Alemán'), ('Árabe', 'Árabe'), ('Bosnio', 'Bosnio'), ('Búlgaro', 'Búlgaro'), ('Catalán', 'Catalán'), ('Checo', 'Checo'), ('Chino', 'Chino'), ('Coreano', 'Coreano'), ('Croata', 'Croata'), ('Danés', 'Danés'), ('Eslovaco', 'Eslovaco'), ('Esloveno', 'Esloveno'), ('Español', 'Español'), ('Español (MX)', 'Español (MX)'), ('Euskera', 'Euskera'), ('Filipino', 'Filipino'), ('Finés', 'Finés'), ('Francés', 'Francés'), ('Francés (CA)', 'Francés (CA)'), ('Gallego', 'Gallego'), ('Georgiano', 'Georgiano'), ('Griego', 'Griego'), ('Hebreo', 'Hebreo'), ('Hindi', 'Hindi'), ('Holandés', 'Holandés'), ('Húngaro', 'Húngaro'), ('Inglés', 'Inglés'), ('Islandés', 'Islandés'), ('Italiano', 'Italiano'), ('Japonés', 'Japonés'), ('Lituano', 'Lituano'), ('Noruego', 'Noruego'), ('Polaco', 'Polaco'), ('Portugués (BR)', 'Portugués (BR)'), ('Portugués (PT)', 'Portugués (PT)'), ('Rumano', 'Rumano'), ('Ruso', 'Ruso'), ('Serbio', 'Serbio'), ('Singalés', 'Singalés'), ('Sueco', 'Sueco'), ('Tailandés', 'Tailandés'), ('Turco', 'Turco'), ('Ucraniano', 'Ucraniano'), ('Urdu', 'Urdu'), ('Valenciano', 'Valenciano'), ('Vietnamita', 'Vietnamita')], default='', max_length=20, verbose_name='Lenguas Nativas'),
        ),
        migrations.AlterField(
            model_name='professionalprofile',
            name='softwares',
            field=models.CharField(blank=True, choices=[('Adobe Indesign', 'Adobe Indesign'), ('SDL TRADOS Studio', 'SDL TRADOS Studio'), ('Wordfast (cat-tool)', 'Wordfast (cat-tool)'), ('Adobe Illustrator', 'Adobe Illustrator'), ('Adobe Photoshop', 'Adobe Photoshop'), ('AutoCAD', 'AutoCAD'), ('FrameMaker', 'FrameMaker'), ('Microsoft Excel', 'Microsoft Excel'), ('Passolo (cat-tool)', 'Passolo (cat-tool)'), ('Microsoft Powerpoint', 'Microsoft Powerpoint'), ('MemoQ', 'MemoQ')], default='', max_length=250, verbose_name='Softwares'),
        ),
        migrations.AlterUniqueTogether(
            name='languagecombination',
            unique_together={('translator', 'source_language', 'target_language')},
        ),
    ]