from rest_framework import serializers
from .models import Translator, ProfessionalProfile, LanguageCombination, Files

class LanguageCombinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageCombination
        fields = '__all__'    

class ProfessionalProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalProfile
        fields = '__all__'

class FilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Files
        fields = ['cv_file', 'voice_note']

class TranslatorSerializer(serializers.ModelSerializer):
    professional_profile = ProfessionalProfileSerializer()
    files = FilesSerializer()    
    language_combination = LanguageCombinationSerializer(many=True)    

    class Meta:
        model = Translator
        #fields = '__all__' 
        exclude = ['is_superuser','password','is_staff','groups','user_permissions']