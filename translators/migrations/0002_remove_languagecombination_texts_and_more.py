# Generated by Django 5.1.3 on 2024-11-27 00:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('translators', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='languagecombination',
            name='texts',
        ),
        migrations.AddField(
            model_name='languagecombination',
            name='text_types',
            field=models.CharField(blank=True, max_length=100, verbose_name='Textos'),
        ),
        migrations.AlterField(
            model_name='languagecombination',
            name='certified_rate',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True, verbose_name='Precio/palabra Jurada'),
        ),
        migrations.AlterField(
            model_name='languagecombination',
            name='rate_per_hour',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True, verbose_name='Precio/hora'),
        ),
        migrations.AlterField(
            model_name='languagecombination',
            name='rate_per_word',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True, verbose_name='Precio/palabra'),
        ),
        migrations.AlterField(
            model_name='languagecombination',
            name='services',
            field=models.CharField(blank=True, max_length=200, verbose_name='Servicios'),
        ),
        migrations.AlterField(
            model_name='languagecombination',
            name='source_language',
            field=models.CharField(choices=[('Alemán', 'Alemán'), ('Árabe', 'Árabe'), ('Bosnio', 'Bosnio'), ('Búlgaro', 'Búlgaro'), ('Catalán', 'Catalán'), ('Checo', 'Checo'), ('Chino', 'Chino'), ('Coreano', 'Coreano'), ('Croata', 'Croata'), ('Danés', 'Danés'), ('Eslovaco', 'Eslovaco'), ('Esloveno', 'Esloveno'), ('Español', 'Español'), ('Español (MX)', 'Español (MX)'), ('Euskera', 'Euskera'), ('Filipino', 'Filipino'), ('Finés', 'Finés'), ('Francés', 'Francés'), ('Francés (CA)', 'Francés (CA)'), ('Gallego', 'Gallego'), ('Georgiano', 'Georgiano'), ('Griego', 'Griego'), ('Hebreo', 'Hebreo'), ('Hindi', 'Hindi'), ('Holandés', 'Holandés'), ('Húngaro', 'Húngaro'), ('Inglés', 'Inglés'), ('Islandés', 'Islandés'), ('Italiano', 'Italiano'), ('Japonés', 'Japonés'), ('Lituano', 'Lituano'), ('Noruego', 'Noruego'), ('Polaco', 'Polaco'), ('Portugués (BR)', 'Portugués (BR)'), ('Portugués (PT)', 'Portugués (PT)'), ('Rumano', 'Rumano'), ('Ruso', 'Ruso'), ('Serbio', 'Serbio'), ('Singalés', 'Singalés'), ('Sueco', 'Sueco'), ('Tailandés', 'Tailandés'), ('Turco', 'Turco'), ('Ucraniano', 'Ucraniano'), ('Urdu', 'Urdu'), ('Valenciano', 'Valenciano'), ('Vietnamita', 'Vietnamita')], max_length=50, verbose_name='Idioma Origen'),
        ),
        migrations.AlterField(
            model_name='languagecombination',
            name='target_language',
            field=models.CharField(choices=[('Alemán', 'Alemán'), ('Árabe', 'Árabe'), ('Bosnio', 'Bosnio'), ('Búlgaro', 'Búlgaro'), ('Catalán', 'Catalán'), ('Checo', 'Checo'), ('Chino', 'Chino'), ('Coreano', 'Coreano'), ('Croata', 'Croata'), ('Danés', 'Danés'), ('Eslovaco', 'Eslovaco'), ('Esloveno', 'Esloveno'), ('Español', 'Español'), ('Español (MX)', 'Español (MX)'), ('Euskera', 'Euskera'), ('Filipino', 'Filipino'), ('Finés', 'Finés'), ('Francés', 'Francés'), ('Francés (CA)', 'Francés (CA)'), ('Gallego', 'Gallego'), ('Georgiano', 'Georgiano'), ('Griego', 'Griego'), ('Hebreo', 'Hebreo'), ('Hindi', 'Hindi'), ('Holandés', 'Holandés'), ('Húngaro', 'Húngaro'), ('Inglés', 'Inglés'), ('Islandés', 'Islandés'), ('Italiano', 'Italiano'), ('Japonés', 'Japonés'), ('Lituano', 'Lituano'), ('Noruego', 'Noruego'), ('Polaco', 'Polaco'), ('Portugués (BR)', 'Portugués (BR)'), ('Portugués (PT)', 'Portugués (PT)'), ('Rumano', 'Rumano'), ('Ruso', 'Ruso'), ('Serbio', 'Serbio'), ('Singalés', 'Singalés'), ('Sueco', 'Sueco'), ('Tailandés', 'Tailandés'), ('Turco', 'Turco'), ('Ucraniano', 'Ucraniano'), ('Urdu', 'Urdu'), ('Valenciano', 'Valenciano'), ('Vietnamita', 'Vietnamita')], max_length=50, verbose_name='Idioma Destino'),
        ),
        migrations.AlterField(
            model_name='professionalprofile',
            name='degree',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Grado'),
        ),
        migrations.AlterField(
            model_name='professionalprofile',
            name='education',
            field=models.CharField(blank=True, max_length=40, null=True, verbose_name='Educación'),
        ),
        migrations.AlterField(
            model_name='professionalprofile',
            name='employment_status',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='Nivel de estudios'),
        ),
        migrations.AlterField(
            model_name='professionalprofile',
            name='experience',
            field=models.IntegerField(blank=True, null=True, verbose_name='Experiencia'),
        ),
        migrations.AlterField(
            model_name='professionalprofile',
            name='native_languages',
            field=models.CharField(blank=True, max_length=20, null=True, verbose_name='Lenguas Nativas'),
        ),
        migrations.AlterField(
            model_name='professionalprofile',
            name='softwares',
            field=models.CharField(blank=True, max_length=250, null=True, verbose_name='Softwares'),
        ),
        migrations.AlterField(
            model_name='translator',
            name='address',
            field=models.CharField(max_length=200, verbose_name='Dirección'),
        ),
        migrations.AlterField(
            model_name='translator',
            name='birth_date',
            field=models.DateField(blank=True, default='2000-01-01', null=True, verbose_name='Fecha de Nacimiento'),
        ),
        migrations.AlterField(
            model_name='translator',
            name='country',
            field=models.CharField(max_length=50, verbose_name='País'),
        ),
        migrations.AlterField(
            model_name='translator',
            name='first_name',
            field=models.CharField(max_length=100, verbose_name='Nombre'),
        ),
        migrations.AlterField(
            model_name='translator',
            name='gender',
            field=models.CharField(default='Otros', max_length=9, verbose_name='Género'),
        ),
        migrations.AlterField(
            model_name='translator',
            name='last_access',
            field=models.DateTimeField(blank=True, default='2000-01-01', null=True, verbose_name='Último acceso'),
        ),
        migrations.AlterField(
            model_name='translator',
            name='last_name',
            field=models.CharField(max_length=200, verbose_name='Apellidos'),
        ),
        migrations.AlterField(
            model_name='translator',
            name='mobile_phone',
            field=models.CharField(blank=True, max_length=18, null=True, verbose_name='Nº Tlf Móvil'),
        ),
        migrations.AlterField(
            model_name='translator',
            name='postal_code',
            field=models.IntegerField(verbose_name='Código Postal'),
        ),
        migrations.AlterField(
            model_name='translator',
            name='province',
            field=models.CharField(max_length=25, verbose_name='Provincia'),
        ),
        migrations.AlterField(
            model_name='translator',
            name='registration_date',
            field=models.DateTimeField(blank=True, default='2000-01-01', null=True, verbose_name='Fecha de registro'),
        ),
    ]