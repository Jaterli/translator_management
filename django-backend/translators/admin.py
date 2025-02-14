from django.contrib import admin
from .models import Translator

@admin.register(Translator)
class TranslatorAdmin(admin.ModelAdmin):
     list_display = ('email', 'first_name', 'last_name', 'last_access', 'is_staff')
     search_fields = ('email', 'first_name', 'last_name', 'last_access', 'is_staff')

# @admin.register(Combinacion)
# class CombinacionAdmin(admin.ModelAdmin):
#     list_display = ('idioma_origen', 'idioma_destino', 'traductor')
#     search_fields = ('idioma_origen', 'idioma_destino')


