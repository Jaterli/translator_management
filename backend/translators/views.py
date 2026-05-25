from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views import View
from django.urls import reverse_lazy
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.mixins import UserPassesTestMixin
from django.views.generic.list import ListView
from django.contrib.auth import update_session_auth_hash
from django.views.generic.edit import CreateView, UpdateView, DeleteView, FormView
from django.views.generic.detail import DetailView

from .models import Translator, LanguageCombination, ProfessionalProfile, Files
from .forms import TranslatorAccountDeleteForm, TranslatorRegistrationForm, TranslatorLoginForm, TranslatorForm, LanguageCombinationForm, ProfessionalProfileForm, FilesForm
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone


@receiver(post_save, sender=Translator)
# La señal post_save asegura que cada vez que se crea un Translator, también se cree automáticamente su ProfessionalProfile
def create_professional_profile(sender, instance, created, **kwargs):
    if created:
        ProfessionalProfile.objects.create(translator=instance)


class TranslatorRegisterView(View):
    def get(self, request):
        form = TranslatorRegistrationForm()
        return render(request, 'translators/register.html', {'form': form})

    def post(self, request):
        form = TranslatorRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Registro exitoso! Ya puedes iniciar sesión.")
            return redirect('login')
        else:
            messages.error(request, "Se ha producido un error durante el registro.")
        return render(request, 'translators/register.html', {'form': form})


class TranslatorLoginView(LoginView):
    template_name = 'translators/login.html'
    authentication_form = TranslatorLoginForm
    redirect_authenticated_user = True

    def get_success_url(self):
        messages.success(self.request, f"Bienvenid@, {self.request.user.email}!")
        return reverse_lazy('dashboard')

    def form_valid(self, form):
        """
        Actualiza el campo last_access del usuario después de un login exitoso.
        """
        response = super().form_valid(form)  # Llama al método form_valid de la clase padre
        user = self.request.user  # Obtiene el usuario autenticado

        # Actualiza el campo last_access con la hora actual
        user.last_access = timezone.now()
        user.save()

        return response

    def form_invalid(self, form):
        messages.error(self.request, "Credenciales no válidos. Vuelve a intentarlo.")
        return super().form_invalid(form)


class TranslatorUpdateView(LoginRequiredMixin, UpdateView):
    model = Translator
    form_class = TranslatorForm
    template_name = 'translators/personal-data-edit.html'
    success_url = reverse_lazy('personal_data')

    def get_object(self):
        return self.request.user


class ProfessionalProfileDetailView(LoginRequiredMixin, DetailView):
    """
    Clase de vista para mostrar los datos del perfil profesional de un traductor.
    """
    model = ProfessionalProfile
    template_name = 'translators/professional-profile.html'
    context_object_name = 'professional_profile'

    def get_object(self, queryset=None):
        """
        Obtiene el perfil profesional del usuario autenticado.
        """
        return self.request.user.professional_profile


class ProfessionalProfileUpdateView(LoginRequiredMixin, UpdateView):
    model = ProfessionalProfile
    form_class = ProfessionalProfileForm
    template_name = 'translators/professional-profile-edit.html'
    success_url = reverse_lazy('professional_profile')

    def get_object(self, queryset=None):
        """
        Sobrescribe este método para obtener o crear el perfil profesional
        del traductor autenticado.
        """
        # Obtener el traductor autenticado
        translator = self.request.user
        
        # Intentar obtener el perfil profesional, crear uno si no existe
        profile, created = ProfessionalProfile.objects.get_or_create(translator=translator)
        if created:
            messages.info(self.request, "Tu perfil profesional se ha creado automáticamente.")
        return profile

    def form_valid(self, form):
        """
        Agrega un mensaje de éxito después de guardar el formulario.
        """        
        print("Datos limpiados:", form.cleaned_data)        
        messages.success(self.request, "Tu perfil profesional ha sido actualizado correctamente.")
        return super().form_valid(form)
    
    def form_invalid(self, form):
        print("Errores en el formulario:", form.errors)        
        messages.error(self.request, "Ocurrió un error al actualizar el perfil. Revisa los campos.")
        return super().form_invalid(form)    
    

class FilesView(LoginRequiredMixin, UpdateView):
    model = Files
    form_class = FilesForm
    template_name = 'translators/files-form.html'
    success_url = reverse_lazy('files')  # Cambiar por la URL correspondiente

    def get_object(self, queryset=None):
        """
        Obtiene el currículum asociado al traductor logueado.
        Si no existe, crea uno vacío.
        """
        files, created = Files.objects.get_or_create(translator=self.request.user)
        return files

    def form_valid(self, form):
        messages.success(self.request, "Tu currículum y nota de voz se han actualizado correctamente.")
        return super().form_valid(form)

    def form_invalid(self, form):
        print("Errores en el formulario:", form.errors)        
        messages.error(self.request, "Se han producido errores.")
        return super().form_invalid(form)


def delete_cv(request):
    """
    Elimina el currículum vitae del traductor.
    """
    files = get_object_or_404(Files, translator=request.user)
    if files.cv_file:
        files.cv_file.delete()
        files.save()
        messages.success(request, "Currículum eliminado con éxito.")
    else:
        messages.error(request, "No se encontró un currículum para eliminar.")
    return redirect('files')  # Redirige a la vista de detalle del traductor


def delete_voice_note(request):
    """
    Elimina la nota de voz del traductor.
    """
    files = get_object_or_404(Files, translator=request.user)
    if files.voice_note:
        files.voice_note.delete()
        files.save()
        messages.success(request, "Nota de voz eliminada con éxito.")
    else:
        messages.error(request, "No se encontró una nota de voz para eliminar.")
    return redirect('files')  # Redirige a la vista de detalle del traductor


class CombinationCreateView(CreateView):
    model = LanguageCombination
    form_class = LanguageCombinationForm
    template_name = 'translators/language-combinations-edit.html'
    success_url = reverse_lazy('language_combinations')

    def form_valid(self, form):
        form.instance.translator = self.request.user
        return super().form_valid(form)


class CombinationUpdateView(UserPassesTestMixin, UpdateView):
    model = LanguageCombination
    form_class = LanguageCombinationForm
    template_name = 'translators/language-combinations-edit.html'
    success_url = reverse_lazy('language_combinations')

    def test_func(self):
        combination = self.get_object()
        return self.request.user == combination.translator

    def handle_no_permission(self):
        from django.http import HttpResponseForbidden
        return HttpResponseForbidden("You do not have permission to edit this combination.")


class CombinationDeleteView(LoginRequiredMixin, DeleteView):
    model = LanguageCombination
    template_name = 'translators/combination-confirm_delete.html'
    success_url = reverse_lazy('language-combinations')


class LanguageCombinationListView(LoginRequiredMixin, ListView):
    model = LanguageCombination
    template_name = 'translators/language-combinations.html'
    context_object_name = 'combinations'

    # Si deseas filtrar las combinaciones por el traductor logueado
    def get_queryset(self):
        return LanguageCombination.objects.filter(translator=self.request.user)
    

class TranslatorAccountDeleteView(LoginRequiredMixin, FormView):
    template_name = "translators/account-delete-confirmation.html"
    form_class = TranslatorAccountDeleteForm
    success_url = reverse_lazy('login')  # Redirige al usuario tras la baja.

    def form_valid(self, form):
        """
        Si el formulario es válido, elimina al traductor y redirige al éxito.
        """
        translator = self.request.user
        # Opcional: agrega lógica para manejar datos relacionados del traductor.
        translator.delete()
        messages.success(self.request, "Tu cuenta ha sido dada de baja correctamente.")
        return redirect(self.success_url)

    def form_invalid(self, form):
        messages.error(self.request, "Debes confirmar la baja para continuar.")
        return super().form_invalid(form)


@login_required
def index(request):
    return render(request, 'translators/index.html')


@login_required
def personal_data(request):
    translator = request.user
    return render(request, 'translators/personal-data.html', {'translator': translator})


@login_required
def language_combinations(request):
    combinations = request.user.combinations.all()
    return render(request, 'translators/language-combinations.html', {'language-combinations': combinations})


@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            return redirect('personal_data')
    else:
        form = PasswordChangeForm(user=request.user)
    return render(request, 'translators/change-password.html', {'form': form})
