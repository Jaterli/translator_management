from rest_framework import serializers
from .models import Translator, ProfessionalProfile, LanguageCombination

class LanguageCombinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageCombination
        fields = '__all__'

class ProfessionalProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalProfile
        fields = '__all__'

class TranslatorSerializer(serializers.ModelSerializer):
    professional_profile = ProfessionalProfileSerializer()
    language_combination = LanguageCombinationSerializer(many=True)

    class Meta:
        model = Translator
        fields = '__all__'  # O puedes especificar los campos que desees