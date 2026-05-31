from django.contrib import admin
from .models import Translator, LanguageCombination, LanguageCombinationApproval

@admin.register(Translator)
class TranslatorAdmin(admin.ModelAdmin):
     list_display = ('email', 'first_name', 'last_name', 'last_access', 'is_staff')
     search_fields = ('email', 'first_name', 'last_name', 'last_access', 'is_staff')

@admin.register(LanguageCombination)
class LanguageCombinationAdmin(admin.ModelAdmin):
    list_display = ('source_language', 'target_language', 'translator')
    search_fields = ('source_language', 'target_language', 'translator')


@admin.register(LanguageCombinationApproval)
class LanguageCombinationApprovalAdmin(admin.ModelAdmin):
     list_display = ('superuser', 'translator', 'language_combination', 'approved_at', 'is_approved')
     search_fields = ('superuser__email', 'translator__email', 'language_combination__source_language', 'language_combination__target_language')  
