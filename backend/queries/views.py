from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from queries.models import SavedQuery
from translators.models import Translator, ProfessionalProfile, LanguageCombination
from django.db.models import Q
from django.apps import apps
from django.conf import settings
import json

# Importaciones para el sistema de autenticación
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


# Devuelve todos los campos disponibles de los modelos registrados en la app translators
def get_model_fields(request):
    # app_models = apps.get_app_config('translators').get_models()
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
                    "verbose_name": '-- '+model_name+' --' if getattr(field, 'verbose_name', '') == 'ID' else getattr(field, 'verbose_name', ''),
                    "choices": getattr(field, 'choices', None),
                }
                fields.append(field_info)
    
    return JsonResponse({"fields": fields})


# Guardar la consulta SQL generada
@csrf_exempt
def save_query(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        query = data.get("query")  # JSON con los filtros

        # Guardar la consulta
        saved_query = SavedQuery.objects.create(name=name, query=query)
        return JsonResponse({"message": "Consulta guardada", "id": saved_query.id})        


def list_queries(request):
    queries = SavedQuery.objects.values("id", "name", "created_at", "query")
    return JsonResponse({"queries": list(queries)})


@csrf_exempt
def delete_query(request, query_id):
    if request.method == "DELETE":
        query = get_object_or_404(SavedQuery, id=query_id)
        query.delete()
        return JsonResponse({"message": "Query deleted successfully."})
    return JsonResponse({"error": "Invalid request method."}, status=400)


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
    for field in instance._meta.fields:
        if field.name in excluded:
            continue  # Saltar campos excluidos

        value = getattr(instance, field.name)

        if isinstance(value, (int, float, str, bool)):  # Tipos simples
            data[field.name] = value
        elif value is not None and hasattr(value, 'all'):  # Si el campo es una relación de muchos a muchos
            data[field.name] = [model_to_dict(obj) for obj in value.all()]
        elif value is not None and hasattr(value, '_meta'):  # Si es una relación de uno a uno
            data[field.name] = model_to_dict(value)
        else:
            data[field.name] = value
    return data

def execute_query(request, query_id):
    try:
        # Obtiene la consulta guardada
        saved_query = SavedQuery.objects.get(id=query_id)
        query_data = saved_query.query  # Asume que query es un JSON válido
        print("query_data: ", query_data, "\n")

        # Relación entre modelos y sus nombres
        related_models = {
            "ProfessionalProfile": "professional_profile",
            "LanguageCombination": "language_combination",
        }

        # Definir campos a excluir para cada modelo
        exclude_fields = {
            'translator': ['password', 'is_superuser', 'is_active', 'is_staff', 'groups', 'user_permissions'],
            'professional_profile': ['translator'],
            'language_combination': ['translator'],
        }

        # Crear lista temporal para almacenar condiciones
        query_filter = Q()  # Filtro final

        # Recorrer las condiciones guardadas
        for condition in query_data:
            model = condition.get("model")
            field = condition.get("field")
            operator = condition.get("operator")
            value = condition.get("value")
            logical = condition.get("logical", "AND")  # Valor predeterminado si falta

            # Obtener prefijo para campos relacionados
            prefix = related_models.get(model, "") + "__" if model in related_models else ""
            field = f"{prefix}{field}"

            # Mapeo de operadores a funciones de Django ORM
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

            # Generar filtro dinámico
            if operator in operators_map:
                field_lookup = f"{field}{operators_map[operator]}"
                if operator == "NOT LIKE":
                    condition_q = ~Q(**{field_lookup: value})
                elif operator == "!=":
                    condition_q = ~Q(**{field: value})
                elif operator == "NOT IN":
                    condition_q = ~Q(**{field_lookup: value})
                elif operator == "IS NULL":
                    condition_q = Q(**{field_lookup: True})
                elif operator == "IS NOT NULL":
                    condition_q = Q(**{field_lookup: False})
                else:
                    condition_q = Q(**{field_lookup: value})

                # Combinar condiciones
                if logical == "AND":
                    query_filter &= condition_q
                elif logical == "OR":
                    query_filter |= condition_q
                else:  # primera condición no tiene operador lógico definido
                    query_filter = condition_q

        # Aplicar el filtro a los traductores
        translators = Translator.objects.filter(query_filter).distinct().select_related(
            'professional_profile'
        ).prefetch_related('language_combination')

        print("Consulta SQL generada:", translators.query)

        # Serializar los datos
        results = []
        for translator in translators:
            translator_data = {
                "Translator": model_to_dict(translator, exclude_fields=exclude_fields)
            }

            # Agregar datos de ProfessionalProfile si existe
            if hasattr(translator, "professional_profile"):
                profile = translator.professional_profile
                translator_data["ProfessionalProfile"] = model_to_dict(profile, exclude_fields=exclude_fields)

            # Agregar datos de LanguageCombination si existe
            translator_data["LanguageCombination"] = [
                model_to_dict(lc, exclude_fields=exclude_fields) for lc in translator.language_combination.all()
            ]

            results.append(translator_data)

        return JsonResponse({"results": results}, safe=False, status=200)

    except SavedQuery.DoesNotExist:
        return JsonResponse({"error": "Consulta no encontrada"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    


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
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'name': user.get_full_name() or user.username,
                    'email': user.email,
                },
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials or not a staff user'}, status=status.HTTP_401_UNAUTHORIZED)