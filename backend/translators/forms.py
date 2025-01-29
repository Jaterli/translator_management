from django import forms
from .models import Translator, ProfessionalProfile, LanguageCombination, Files, validate_file_size, validate_file_type
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm, PasswordChangeForm
from .consts import SOFTWARES, LANGUAGES, TEXT_TYPES, SERVICES


class TranslatorRegistrationForm(UserCreationForm):

    class Meta:
        model = Translator
        fields = ['first_name', 'last_name', 'email', 'password1', 'password2', 'address', 'postal_code', 'province', 'country', 'gender', 'mobile_phone', 'birth_date']

    first_name = forms.CharField(
        max_length=100,
        label="Nombre",
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    last_name = forms.CharField(
        max_length=200,
        label="Apellidos",
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    address = forms.CharField(
        max_length=200,
        label="Dirección",
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    postal_code = forms.IntegerField(
        label="Código Postal",
        widget=forms.NumberInput(attrs={'class': 'form-control'})
    )
    province = forms.CharField(
        max_length=50,
        label="Provincia",
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    country = forms.ChoiceField(
        choices=[('', 'Seleccione una opción')] + Translator._meta.get_field('country').choices,      
        label="País",
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    gender = forms.ChoiceField(
        choices=[('', 'Seleccione una opción')] + Translator._meta.get_field('gender').choices,
        label="Género",
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    email = forms.EmailField(
        label="Email",
        widget=forms.EmailInput(attrs={'class': 'form-control'})
    )
    mobile_phone = forms.CharField(
        max_length=18,
        required=False,
        label="Tlf. Móvil",
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    birth_date = forms.DateField(
        label="Fecha de Nacimiento",
        widget=forms.DateInput(attrs={'class': 'form-control', 'type': 'date'})
    )
    password1 = forms.CharField(
        label="Contraseña",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        help_text=(
            "La contraseña debe tener al menos 8 caracteres, no debe ser común y no debe contener solo números."
        )
    )
    password2 = forms.CharField(
        label="Confirmar Contraseña",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        help_text="Intruduce la misma contraseña para confirmarla."
    )

    def save(self, commit=True):
        translator = super().save(commit=False)
        translator.is_active = True  # Activate the user by default
        if commit:
            translator.save()
        return translator



class TranslatorLoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Email'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Contraseña'}))



class TranslatorForm(forms.ModelForm):
    class Meta:
        model = Translator
        fields = ['first_name', 'last_name', 'email', 'address', 'postal_code', 'country', 'province', 'gender', 'mobile_phone', 'birth_date']



class ProfessionalProfileForm(forms.ModelForm):
    """
    Formulario para actualizar el perfil profesional del traductor.
    """
    class Meta:
        model = ProfessionalProfile
        fields = ['native_languages', 'education', 'degree', 'employment_status', 'experience', 'softwares']

    native_languages = forms.MultipleChoiceField(
        label="Lenguas Nativas",
        choices=LANGUAGES,
        widget=forms.CheckboxSelectMultiple(),
        required=True
    )
    education = forms.ChoiceField(
        label="Educación",
        required=False,
        choices=[('', 'Seleccione una opción')] + ProfessionalProfile._meta.get_field('education').choices,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    degree = forms.CharField(
        label="Grado",
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ejemplo: Máster en Interpretación'})
    )
    employment_status = forms.ChoiceField(
        label="Situación Laboral",
        required=True,
        choices=[('', 'Seleccione una opción')] + ProfessionalProfile._meta.get_field('employment_status').choices,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    experience = forms.ChoiceField(
        label="Experiencia",
        required=True,
        choices=[('', 'Seleccione una opción')] + ProfessionalProfile._meta.get_field('experience').choices,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    softwares = forms.MultipleChoiceField(
        label="Softwares",
        required=False,
        choices=SOFTWARES,
        widget=forms.CheckboxSelectMultiple()
    )
  
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.softwares:
            self.initial['softwares'] = self.instance.softwares.split(', ')
        if self.instance and self.instance.native_languages:
            self.initial['native_languages'] = self.instance.native_languages.split(', ')

    def clean_softwares(self):
        softwares = self.cleaned_data.get('softwares', [])
        return ', '.join(softwares)

    def clean_native_languages(self):
        selected_languages = self.cleaned_data['native_languages']
        if len(selected_languages) > 2:  # Límite de selección
            raise forms.ValidationError("Solo puedes seleccionar hasta 2 lenguas nativas.")
        return ', '.join(selected_languages)



class FilesForm(forms.ModelForm):
    class Meta:
        model = Files
        fields = ['cv_file', 'voice_note']
        widgets = {
            'cv_file': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'voice_note': forms.ClearableFileInput(attrs={'class': 'form-control'}),
        }
        labels = {
            'cv_file': 'Currículum Vitae',
            'voice_note': 'Nota de Voz (opcional)',
        }

    def clean(self):
        cleaned_data = super().clean()
        cv_file = cleaned_data.get("cv_file")
        voice_note = cleaned_data.get("voice_note")
        
        if cv_file:
            try:
                self.instance.cv_file = cv_file  # Asigna el archivo para validar
                self.instance.clean()  # Llama al clean del modelo
            except forms.ValidationError as e:
                self.add_error('cv_file', e.message)

        if voice_note:
            try:
                self.instance.voice_note = voice_note  # Asigna el archivo para validar
                self.instance.clean()  # Llama al clean del modelo
            except forms.ValidationError as e:
                self.add_error('voice_note', e.message)

        return cleaned_data
    
    def clean_cv_file(self):
        cv_file = self.cleaned_data.get('cv_file')
        if cv_file:
            validate_file_size(cv_file)  # Llamar a la validación de tamaño del archivo
            valid_types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
            validate_file_type(cv_file, valid_types)  # Llamar a la validación del tipo
        return cv_file

    def clean_voice_note(self):
        voice_note = self.cleaned_data.get('voice_note')
        if voice_note:
            validate_file_size(voice_note)  # Validar el tamaño
            valid_types = ['audio/mpeg', 'audio/wav', 'audio/mp3']
            validate_file_type(voice_note, valid_types)  # Validar el tipo
        return voice_note



class LanguageCombinationForm(forms.ModelForm):
    class Meta:
        model = LanguageCombination
        fields = ['source_language', 'target_language', 'services', 'text_types', 'price_per_word', 'sworn_price_per_word', 'price_per_hour']

        widgets = {
            'price_per_word': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Precio por palabra (€)'}),
            'sworn_price_per_word': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Precio por palabra Traducción Jurada (€)'}),
            'price_per_hour': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Precio por hora (€)'}),
        }

    services = forms.MultipleChoiceField(
        label="Servicios",       
        choices=SERVICES,
        widget=forms.CheckboxSelectMultiple,
        required=True
    )

    text_types = forms.MultipleChoiceField(
        label="Tipos de Texto",
        choices=TEXT_TYPES,
        widget=forms.CheckboxSelectMultiple,
        required=True
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.services:
            self.initial['services'] = self.instance.services.split(', ')
        if self.instance and self.instance.text_types:
            self.initial['text_types'] = self.instance.text_types.split(', ')

    def clean_services(self):
        services = self.cleaned_data.get('services', [])
        return ', '.join(services)

    def clean_text_types(self):
        text_types = self.cleaned_data.get('text_types', [])
        return ', '.join(text_types) 
    

class CustomPasswordChangeForm(PasswordChangeForm):
    """
    Formulario para cambiar la contraseña, heredado de PasswordChangeForm.
    """
    old_password = forms.CharField(
        label="Contraseña actual",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )
    new_password1 = forms.CharField(
        label="Nueva contraseña",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )
    new_password2 = forms.CharField(
        label="Confirmar nueva contraseña",
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )


class TranslatorAccountDeleteForm(forms.Form):
    confirm = forms.BooleanField(
        required=True,
        label="Confirmo que deseo dar de baja mi cuenta."
    )    