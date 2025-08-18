from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from datetime import date
from django.utils import timezone
import os
import mimetypes
from .consts import LANGUAGES, GENDER, COUNTRIES, PROVINCES, LEVEL_EDUCATION, EMPLOYMENT_STATUS, WORK_EXPERIENCE


class TranslatorManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The email address is mandatory')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class Translator(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, verbose_name='Email')    
    first_name = models.CharField(max_length=100, verbose_name='Nombre')
    last_name = models.CharField(max_length=200, verbose_name='Apellidos')
    address = models.CharField(max_length=200, verbose_name='Dirección')
    postal_code = models.IntegerField(null=True, verbose_name='Código Postal')
    province = models.CharField(max_length=25, choices=PROVINCES, verbose_name='Provincia')
    country = models.CharField(max_length=50, choices=COUNTRIES, verbose_name='País', blank=True)
    gender = models.CharField(max_length=9, choices=GENDER, verbose_name='Género', default='Otros')    
    mobile_phone = models.CharField(max_length=18, blank=True, verbose_name='Nº Tlf Móvil')
    birth_date = models.DateField(null=True, blank=True, default=date(2000, 1, 1), verbose_name='Fecha de Nacimiento')
    registration_date = models.DateTimeField(null=True, blank=True, default=timezone.now, verbose_name='Fecha de registro')
    last_access = models.DateTimeField(null=True, blank=True, default=date(2000, 1, 1), verbose_name='Último acceso')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = TranslatorManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def __str__(self):
        return self.email


class ProfessionalProfile(models.Model):
    translator = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='professional_profile')
    native_languages = models.TextField(max_length=20, blank=False, default='', verbose_name='Lenguas Nativas')
    education = models.CharField(max_length=40, choices=LEVEL_EDUCATION, blank=False, verbose_name='Educación')
    degree = models.CharField(max_length=50, blank=True, verbose_name='Titulo')
    employment_status = models.CharField(max_length=20, choices=EMPLOYMENT_STATUS, null=True, blank=False, verbose_name='Situación Laboral')
    experience = models.CharField(max_length=10, choices=WORK_EXPERIENCE, blank=False, verbose_name='Experiencia')
    softwares = models.TextField(max_length=250, blank=True, default='', verbose_name='Softwares')

    def __str__(self):
        return f"Profile of {self.translator.email}"
    

class LanguageCombination(models.Model):
    translator = models.ForeignKey(Translator, on_delete=models.CASCADE, related_name='language_combination')
    source_language = models.CharField(max_length=50, choices=LANGUAGES, blank=False, verbose_name='Idioma Origen')
    target_language = models.CharField(max_length=50, choices=LANGUAGES, blank=False, verbose_name='Idioma Destino')
    services = models.TextField(max_length=200, blank=True, verbose_name='Servicios')
    text_types = models.TextField(max_length=100, blank=True, verbose_name='Textos')
    price_per_word = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True, verbose_name='Precio/pal. (€)')
    sworn_price_per_word = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True, verbose_name='Precio/pal. Jurada (€)')
    price_per_hour = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, verbose_name='Precio/hora (€)')

    REQUIRED_FIELDS = ['source_language', 'target_language']

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['translator', 'source_language', 'target_language'], 
                name='unique_language_combination'
            )
    ]

    def __str__(self):
        services_display = self.get_services_display()
        return f"{self.source_language} → {self.target_language} ({services_display})"

    def get_services_display(self):
        services_list = self.services.split(',') if self.services else []
        return ", ".join([service.strip() for service in services_list])
    


def cv_upload_path(instance, filename):
    """
    Genera la ruta de almacenamiento para el currículum.
    Estructura: <id del traductor>/cv_file/<nombre_archivo>
    """
    print("Path cv: ",os.path.join(str(instance.translator.id), 'cv_file', filename))
    return os.path.join(str(instance.translator.id), 'cv_file', filename)

def voice_note_upload_path(instance, filename):
    """
    Genera la ruta de almacenamiento para la nota de voz.
    Estructura: <id del traductor>/voice_note/<nombre_archivo>
    """
    return os.path.join(str(instance.translator.id), 'voice_note', filename)


# Tamaño máximo permitido para los archivos (en bytes)
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

def validate_file_type(file, valid_types):
    """
    Valida que el tipo MIME del archivo sea permitido.
    """
    print("Validando tipo de archivo")
    mime_type, _ = mimetypes.guess_type(file.name)  # Detecta el tipo MIME basado en el nombre del archivo
    if mime_type not in valid_types:
        print("ERROR tipo de archivo")
        raise ValidationError(f"El archivo debe ser uno de los siguientes tipos: {', '.join(valid_types)}")    
    else:
        print("Sin error tipo de archivo")
  
    
def validate_file_size(file):
    """
    Valida que el tamaño del archivo no exceda el máximo permitido.
    """
    if file.size > MAX_FILE_SIZE:
        raise ValidationError(f"El tamaño del archivo no puede exceder los {MAX_FILE_SIZE // (1024 * 1024)} MB.")

class Files(models.Model):
    translator = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='files',
        verbose_name='Traductor'
    )
    cv_file = models.FileField(
        upload_to=cv_upload_path,
        blank=False,
        verbose_name='Currículum Vitae'
    )
    voice_note = models.FileField(
        upload_to=voice_note_upload_path,
        blank=True,
        null=True,
        verbose_name='Nota de Voz'
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de Subida'
    )

    def __str__(self):
        return f"Currículum de {self.translator.email}"

    def clean(self):
        """
        Realiza validaciones personalizadas para los archivos.
        """
        valid_cv_types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        valid_voice_types = ['audio/mpeg', 'audio/wav', 'audio/mp3']

        if self.cv_file:
            validate_file_type(self.cv_file, valid_cv_types)
            validate_file_size(self.cv_file)

        if self.voice_note:
            validate_file_type(self.voice_note, valid_voice_types)
            validate_file_size(self.voice_note)