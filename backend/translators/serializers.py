from rest_framework import serializers
from .models import Translator, ProfessionalProfile, LanguageCombination, LanguageCombinationApproval, Files

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

# class TranslatorSerializer(serializers.ModelSerializer):
#     professional_profile = ProfessionalProfileSerializer()
#     files = FilesSerializer()    
#     language_combination = LanguageCombinationSerializer(many=True)    

#     class Meta:
#         model = Translator
#         #fields = '__all__' 
#         exclude = ['is_superuser','password','is_staff','groups','user_permissions']


class LanguageCombinationApprovalSerializer(serializers.ModelSerializer):
    superuser_email = serializers.EmailField(source='superuser.email', read_only=True)
    translator_name = serializers.CharField(source='translator.get_full_name', read_only=True)
    combination_details = serializers.CharField(source='language_combination.__str__', read_only=True)
    
    class Meta:
        model = LanguageCombinationApproval
        fields = ['id', 'superuser', 'superuser_email', 'translator', 'translator_name', 
                  'language_combination', 'combination_details', 'approved_at', 'is_approved', 'notes']
        read_only_fields = ['approved_at']

class TranslatorDetailSerializer(serializers.ModelSerializer):
    professional_profile = ProfessionalProfileSerializer()
    language_combination = LanguageCombinationSerializer(many=True)
    files = FilesSerializer()
    approved_combinations = serializers.SerializerMethodField()
    
    class Meta:
        model = Translator
        fields = ['id', 'email', 'first_name', 'last_name', 'address', 'postal_code', 
                  'province', 'country', 'gender', 'mobile_phone', 'birth_date', 
                  'registration_date', 'last_access', 'professional_profile', 
                  'language_combination', 'files', 'approved_combinations']
    
    def get_approved_combinations(self, obj):
        approvals = obj.approved_combinations.filter(is_approved=True)
        return LanguageCombinationApprovalSerializer(approvals, many=True).data        