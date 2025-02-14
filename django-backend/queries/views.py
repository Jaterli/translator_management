from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from queries.models import SavedQuery
from translators.models import Translator, ProfessionalProfile, LanguageCombination
from django.db.models import Q
from django.db import models
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAdminUser


class GetModelFieldsView(APIView):
    permission_classes = [IsAdminUser]  # Solo administradores pueden acceder

    def get(self, request):
        # Modelos registrados en la app "translators"
        app_models = [Translator, ProfessionalProfile, LanguageCombination]
        fields = []

        for model in app_models:
            model_name = model.__name__

            for field in model._meta.get_fields(include_hidden=False):
                if not field.is_relation:  # Excluir relaciones m2m, o2m
                    field_info = {
                        "model": model_name,
                        "name": field.name,
                        "type": type(field).__name__,
                        "verbose_name": '-- ' + model_name + ' --' if getattr(field, 'verbose_name', '') == 'ID' else getattr(field, 'verbose_name', ''),
                        "choices": getattr(field, 'choices', None),
                    }
                    fields.append(field_info)

        return Response({"fields": fields}, status=status.HTTP_200_OK)


class SaveQueryView(APIView):
    # Guardar la consulta SQL generada
    permission_classes = [IsAdminUser]  # Solo administradores pueden guardar consultas

    def post(self, request):
        data = request.data  # DRF maneja automáticamente JSON
        name = data.get("name")
        query = data.get("query")  # JSON con los filtros

        if not name or not query:
            return Response({"error": "El nombre y la consulta son obligatorios."}, status=status.HTTP_400_BAD_REQUEST)

        # Guardar la consulta
        saved_query = SavedQuery.objects.create(name=name, query=query)
        return Response({"message": "Consulta guardada", "id": saved_query.id}, status=status.HTTP_201_CREATED)


class ListQueriesView(APIView):
    permission_classes = [IsAdminUser]  # Solo permite usuarios con is_staff=True

    def get(self, request):
        queries = SavedQuery.objects.values("id", "name", "created_at", "query")
        return Response({"queries": list(queries)})


class DeleteQueryView(APIView):
    # ✅ Eliminar consulta (solo staff)
    permission_classes = [IsAdminUser]

    def delete(self, request, query_id):
        query = get_object_or_404(SavedQuery, id=query_id)
        query.delete()
        return Response({"message": "Consulta eliminada correctamente."}, status=status.HTTP_204_NO_CONTENT)
    

# Función para convertir una instancia de modelo a diccionario
def model_to_dict(instance, exclude_fields=None):
    """
    Convierte una instancia de modelo en un diccionario serializable.
    """
    if exclude_fields is None:
        exclude_fields = {}

    model_name = instance._meta.model_name
    excluded = exclude_fields.get(model_name, [])

    data = {}
    for field in instance._meta.get_fields():
        if field.name in excluded:
            continue  # Omitir campos excluidos

        value = getattr(instance, field.name, None)

        if isinstance(field, (models.ForeignKey, models.OneToOneField)) and value is not None:
            data[field.name] = model_to_dict(value, exclude_fields)
        elif isinstance(field, models.ManyToManyField):
            data[field.name] = [model_to_dict(obj, exclude_fields) for obj in value.all()]
        elif isinstance(value, (int, float, str, bool, type(None))):  # Tipos simples + None
            data[field.name] = value

    return data


class ExecuteQueryView(APIView):
    permission_classes = [IsAdminUser]  # Solo administradores pueden acceder

    def get(self, request, query_id):
        try:
            saved_query = get_object_or_404(SavedQuery, id=query_id)
            query_data = saved_query.query  # Se asume que es un JSON válido
            print("query_data: ", query_data, "\n")

            related_models = {
                "ProfessionalProfile": "professional_profile",
                "LanguageCombination": "language_combination",
            }

            exclude_fields = {
                'translator': ['password', 'is_superuser', 'is_active', 'is_staff', 'groups', 'user_permissions'],
                'professional_profile': ['translator'],
                'language_combination': ['translator'],
            }

            query_filter = Q()

            operators_map = {
                "=": "",
                "!=": "",
                "LIKE": "__icontains",
                "NOT LIKE": "__icontains",
                ">": "__gt",
                "<": "__lt",
                ">=": "__gte",
                "<=": "__lte",
                "IN": "__in",
                "NOT IN": "__in",
                "IS NULL": "__isnull",
                "IS NOT NULL": "__isnull",
            }

            for condition in query_data:
                model = condition.get("model")
                field = condition.get("field")
                operator = condition.get("operator")
                value = condition.get("value")
                logical = condition.get("logical", "AND")

                field_lookup = f"{related_models.get(model, '')}__{field}".strip("_")
                field_lookup += operators_map.get(operator, "")

                condition_q = {
                    "NOT LIKE": ~Q(**{field_lookup: value}),
                    "!=": ~Q(**{field: value}),
                    "NOT IN": ~Q(**{field_lookup: value}),
                    "IS NULL": Q(**{field_lookup: True}),
                    "IS NOT NULL": Q(**{field_lookup: False}),
                }.get(operator, Q(**{field_lookup: value}))

                query_filter = query_filter & condition_q if logical == "AND" else query_filter | condition_q

            translators = Translator.objects.filter(query_filter & ~Q(is_staff=True)).distinct().select_related(
                'professional_profile'
            ).prefetch_related('language_combination')

            print("Consulta SQL generada:", translators.query)

            results = [
                {
                    "Translator": model_to_dict(t, exclude_fields),
                    "ProfessionalProfile": model_to_dict(t.professional_profile, exclude_fields)
                    if hasattr(t, "professional_profile") else None,
                    "LanguageCombination": [
                        model_to_dict(lc, exclude_fields) for lc in t.language_combination.all()
                    ],
                }
                for t in translators
            ]          

            return Response({"results": results}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StaffLoginView(APIView):
    """
    Autentiqua a los usuarios is_staff y devuelva un token JWT.
    """
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user and user.is_staff:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {
                    'name': user.get_full_name() or user.username,
                    'email': user.email,
                },
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error #2': 'Credenciales inválidas o usuario no autorizado'}, status=status.HTTP_401_UNAUTHORIZED)