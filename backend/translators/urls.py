from django.urls import path
from .views import TranslatorRegisterView, TranslatorLoginView, TranslatorUpdateView, TranslatorDetailView, CombinationCreateView, CombinationUpdateView, CombinationDeleteView, ProfessionalProfileUpdateView, LanguageCombinationListView, ProfessionalProfileDetailView, TranslatorAccountDeleteView, FilesView
from . import views



urlpatterns = [
    path('register/', TranslatorRegisterView.as_view(), name='register'),
    path('login/', TranslatorLoginView.as_view(), name='login'),
    path('translator/edit/', TranslatorUpdateView.as_view(), name='translator-edit'),
    path('translator/', TranslatorDetailView.as_view(), name='index'),    
    path('combinations/add/', CombinationCreateView.as_view(), name='combination-add'),
    path('combinations/<int:pk>/edit/', CombinationUpdateView.as_view(), name='combination-edit'),    
    path('combination/<int:pk>/delete/', CombinationDeleteView.as_view(), name='combination-delete'),
    path('', views.index, name='index'),
    path('profile/', views.profile, name='profile'),
    path('professional-profile/', ProfessionalProfileDetailView.as_view(), name='professional-profile-detail'),    
    path('professional_profile/edit/', ProfessionalProfileUpdateView.as_view(), name='professional-profile-edit'),
    path('language_combinations-list/', LanguageCombinationListView.as_view(), name='language-combinations-list'),
    path('files/', FilesView.as_view(), name='files'),  
    path('files/delete-cv/', views.delete_cv, name='delete-cv'),
    path('files/delete-voice-note/', views.delete_voice_note, name='delete-voice-note'),      
    path('change_pw/', views.change_password, name='change-pw'),
    path('translator/account_delete/', TranslatorAccountDeleteView.as_view(), name='translator-account-delete'),
]
