from django.urls import path
from .views import TranslatorRegisterView, TranslatorLoginView, TranslatorUpdateView, CombinationCreateView, CombinationUpdateView, CombinationDeleteView, ProfessionalProfileUpdateView, LanguageCombinationListView, ProfessionalProfileDetailView, TranslatorAccountDeleteView, FilesView
from . import views



urlpatterns = [
    path('register/', TranslatorRegisterView.as_view(), name='register'),
    path('login/', TranslatorLoginView.as_view(), name='login'),
    path('translator/edit/', TranslatorUpdateView.as_view(), name='translator_edit'),
    #path('translator/', TranslatorDetailView.as_view(), name='dashboard'),    
    path('combinations/add/', CombinationCreateView.as_view(), name='combination_add'),
    path('combinations/edit/<int:pk>/', CombinationUpdateView.as_view(), name='combination_edit'),    
    path('combination/delete/<int:pk>/', CombinationDeleteView.as_view(), name='combination_delete'),
    path('', views.index, name='dashboard'),
    path('personal-data/', views.personal_data, name='personal_data'),
    path('professional-profile/', ProfessionalProfileDetailView.as_view(), name='professional_profile'),    
    path('professional-profile/edit/', ProfessionalProfileUpdateView.as_view(), name='professional_profile_edit'),
    path('language-combinations/', LanguageCombinationListView.as_view(), name='language_combinations'),
    path('files/', FilesView.as_view(), name='files'),  
    path('files/delete-cv/', views.delete_cv, name='delete_cv'),
    path('files/delete-voice-note/', views.delete_voice_note, name='delete_voice_note'),      
    path('change_pw/', views.change_password, name='change_pw'),
    path('translator/account-delete/', TranslatorAccountDeleteView.as_view(), name='translator_account_delete'),
]
