# Translation Marketplace Application

## Descripción
Este proyecto es una aplicación web desarrollada en Django (Backend) + React (Frontend), destinada a gestionar un Marketplace para traductores. Incluye funcionalidad para que los traductores se registren, inicien sesión, gestionen su perfil personal y profesional, añadan combinaciones de idiomas y administren sus archivos.

## Requisitos previos

- Python 3.8 o superior
- Django 4.x
- PostgreSQL (opcional, se puede usar SQLite para pruebas)
- Bootstrap (incluido en el entorno virtual)

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <URL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
   ```

2. Crear y activar un entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. Instalar las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Configurar las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto y añade las configuraciones necesarias, por ejemplo:
   ```env
   DEBUG=True
   SECRET_KEY=<tu_secreto>
   ALLOWED_HOSTS=localhost,127.0.0.1
   DATABASE_URL=sqlite:///db.sqlite3  # Cambiar según la base de datos que uses
   ```

5. Aplicar las migraciones:
   ```bash
   python manage.py migrate
   ```

6. Crear un superusuario:
   ```bash
   python manage.py createsuperuser
   ```

7. Iniciar el servidor de desarrollo:
   ```bash
   python manage.py runserver
   ```

## Estructura de URLs

### URLs del proyecto principal
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('translators/', include('translators.urls')),
    path('accounts/logout/', LogoutView.as_view(next_page='login'), name='logout'),
]
```

### URLs de la aplicación `translators`
```python
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
```

## Formularios principales

### Registro de traductores
Formulario para registrar nuevos traductores:
```python
class TranslatorRegistrationForm(UserCreationForm):
    class Meta:
        model = Translator
        fields = ['first_name', 'last_name', 'email', 'password1', 'password2', 'address', 'postal_code', 'province', 'country', 'gender', 'mobile_phone', 'birth_date']
```

### Login de traductores
Formulario para iniciar sesión:
```python
class TranslatorLoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Email'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Contraseña'}))
```

### Perfil profesional
Formulario para actualizar el perfil profesional del traductor:
```python
class ProfessionalProfileForm(forms.ModelForm):
    class Meta:
        model = ProfessionalProfile
        fields = ['native_languages', 'education', 'degree', 'employment_status', 'experience', 'softwares']
```

### Archivos
Formulario para subir o gestionar archivos:
```python
class FilesForm(forms.ModelForm):
    class Meta:
        model = Files
        fields = ['cv_file', 'voice_note']
```

### Combinaciones de idiomas
Formulario para añadir o editar combinaciones de idiomas:
```python
class LanguageCombinationForm(forms.ModelForm):
    class Meta:
        model = LanguageCombination
        fields = ['source_language', 'target_language', 'services', 'text_types', 'price_per_word', 'sworn_price_per_word', 'price_per_hour']
```

## Vistas principales

- **Registrar traductor:** `TranslatorRegisterView`
- **Iniciar sesión:** `TranslatorLoginView`
- **Editar perfil:** `TranslatorUpdateView`
- **Ver perfil:** `TranslatorDetailView`
- **Añadir combinación:** `CombinationCreateView`
- **Editar combinación:** `CombinationUpdateView`
- **Eliminar combinación:** `CombinationDeleteView`

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.


