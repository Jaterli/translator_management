from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from queries.models import SavedQuery
from translators.models import Translator, ProfessionalProfile, LanguageCombination, LanguageCombinationApproval
from django.db.models import Q, Count
from django.db import models
from django.contrib.auth import authenticate
from django.db import IntegrityError
from django.contrib.auth import get_user_model
from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAdminUser
from rest_framework import generics
from translators.serializers import TranslatorDetailSerializer, LanguageCombinationApprovalSerializer
from translators.permissions import IsStaffPermission
from translators.consts import LANGUAGES

class GetModelFieldsView(APIView):
    permission_classes = [IsAdminUser]  # Solo administradores pueden acceder

    def get(self, request):
        # Modelos registrados en la app "translators"
        app_models = [Translator, ProfessionalProfile, LanguageCombination, LanguageCombinationApproval]
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
    permission_classes = [IsAdminUser]

    def post(self, request):
        try:
            data = request.data
            name = data.get("name")
            query = data.get("query")

            if not name:
                return Response(
                    {"success": False, "error": "El nombre es obligatorio."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not query:
                return Response(
                    {"success": False, "error": "La consulta es obligatoria."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Guardar la consulta
            saved_query = SavedQuery.objects.create(name=name, query=query)
            return Response({
                "success": True, 
                "message": "Consulta guardada", 
                "data": {
                    "id": saved_query.id,
                    "name": saved_query.name
                }
            }, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return Response(
                {"success": False, "error": "Ya existe una consulta con este nombre. Por fa"
                "r, elige otro nombre."},
                status=status.HTTP_409_CONFLICT
            )
        except Exception as e:
            return Response(
                {"success": False, "error": f"Error interno del servidor: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        
class ListQueriesView(APIView):
    permission_classes = [IsAdminUser]  # Solo permite usuarios con is_staff=True

    def get(self, request):
        queries = SavedQuery.objects.values("id", "name", "created_at", "query").order_by('-created_at')
        return Response({"queries": list(queries)})


class DeleteQueryView(APIView):
    # Eliminar consulta (solo staff)
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
        elif isinstance(value, (int, float, str, bool, Decimal, type(None))):  # Tipos simples + None
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
                'professionalprofile': ['translator'],
                'languagecombination': ['translator'],
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
        

class TranslatorDetailViewForAdmin(generics.RetrieveAPIView):
    """
    Para el frontend de React.
    """
    queryset = Translator.objects.all()
    serializer_class = TranslatorDetailSerializer
    permission_classes = [IsStaffPermission]  # Solo usuarios autenticados y con is_staff=True
    lookup_field = 'id'



User = get_user_model()

class ApproveLanguageCombinationView(APIView):
    """
    Vista para que un superusuario homologue una combinación de idiomas de un traductor
    """
    permission_classes = [IsAdminUser]  # Solo superusuarios pueden homologar

    def post(self, request):
        translator_id = request.data.get('translator_id')
        combination_id = request.data.get('combination_id')
        notes = request.data.get('notes', '')

        if not translator_id or not combination_id:
            return Response(
                {"error": "Se requiere translator_id y combination_id"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            translator = Translator.objects.get(id=translator_id)
            combination = LanguageCombination.objects.get(id=combination_id, translator=translator)
            
            # Verificar si ya existe la homologación
            approval, created = LanguageCombinationApproval.objects.get_or_create(
                superuser=request.user,
                translator=translator,
                language_combination=combination,
                defaults={'notes': notes}
            )
            
            if not created and not approval.is_approved:
                # Reactivar homologación si estaba deshomologada
                approval.is_approved = True
                approval.notes = notes or approval.notes
                approval.save()
                message = "Homologación reactivada correctamente"
            elif not created:
                return Response(
                    {"error": "Esta combinación ya está homologada por este superusuario"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                message = "Combinación homologada correctamente"
            
            serializer = LanguageCombinationApprovalSerializer(approval)
            return Response({
                "success": True,
                "message": message,
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Translator.DoesNotExist:
            return Response({"error": "Traductor no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except LanguageCombination.DoesNotExist:
            return Response({"error": "Combinación de idiomas no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DisapproveLanguageCombinationView(APIView):
    """
    Vista para que un superusuario deshomologue una combinación de idiomas
    """
    permission_classes = [IsAdminUser]

    def delete(self, request, approval_id):
        try:
            approval = LanguageCombinationApproval.objects.get(id=approval_id, superuser=request.user)
            approval.is_approved = False
            approval.save()
            
            return Response({
                "success": True,
                "message": "Homologación eliminada correctamente"
            }, status=status.HTTP_200_OK)
            
        except LanguageCombinationApproval.DoesNotExist:
            return Response({"error": "Homologación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListApprovedCombinationsView(APIView):
    """
    Vista para listar todas las combinaciones homologadas (con filtros opcionales)
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        translator_id = request.query_params.get('translator_id')
        language_pair = request.query_params.get('language_pair')  # formato "es-en"
        
        approvals = LanguageCombinationApproval.objects.filter(is_approved=True)
        
        if translator_id:
            approvals = approvals.filter(translator_id=translator_id)
        
        if language_pair:
            # Buscar por combinación de idiomas
            source, target = language_pair.split('-')
            approvals = approvals.filter(
                language_combination__source_language=source,
                language_combination__target_language=target
            )
            print("Filtrando por language_pair:", source, "->", target)
        
        serializer = LanguageCombinationApprovalSerializer(approvals, many=True)
        return Response({
            "success": True,
            "count": approvals.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)    
    

class AvailableLanguagesView(APIView):
    """
    Vista para obtener los idiomas disponibles en combinaciones homologadas
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            # Obtener todas las combinaciones homologadas
            approved_combinations = LanguageCombinationApproval.objects.filter(is_approved=True)
            
            # Extraer todos los source_language y target_language únicos
            source_languages_set = set()
            target_languages_set = set()
            
            for approval in approved_combinations:
                combination = approval.language_combination
                if combination.source_language:
                    source_languages_set.add(combination.source_language)
                if combination.target_language:
                    target_languages_set.add(combination.target_language)
            
            # Obtener nombres de idiomas desde la constante LANGUAGES
            languages_dict = dict(LANGUAGES)
            
            # Formatear la respuesta
            source_languages = [
                {
                    "code": lang_code,
                    "name": languages_dict.get(lang_code, lang_code)
                }
                for lang_code in sorted(source_languages_set)
            ]
            
            target_languages = [
                {
                    "code": lang_code,
                    "name": languages_dict.get(lang_code, lang_code)
                }
                for lang_code in sorted(target_languages_set)
            ]
            
            return Response({
                "success": True,
                "source_languages": source_languages,
                "target_languages": target_languages,
                "total_sources": len(source_languages),
                "total_targets": len(target_languages)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardStatsView(APIView):
    """
    Vista para obtener estadísticas para el dashboard
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        try:
            # Estadísticas de traductores
            total_translators = Translator.objects.filter(is_staff=False).count()
            active_translators = Translator.objects.filter(
                is_staff=False, 
                is_active=True
            ).count()
            
            # Estadísticas de combinaciones de idiomas
            total_combinations = LanguageCombination.objects.count()
            
            # Combinaciones de idiomas más populares (las que más traductores tienen)
            popular_pairs = LanguageCombination.objects.values(
                'source_language', 'target_language'
            ).annotate(
                count=Count('translator', distinct=True)
            ).order_by('-count')[:5]
            
            popular_language_pairs = [
                {
                    'pair': f"{item['source_language']} → {item['target_language']}",
                    'count': item['count']
                }
                for item in popular_pairs
            ]
            
            return Response({
                'total_translators': total_translators,
                'active_translators': active_translators,
                'total_combinations': total_combinations,
                'popular_language_pairs': popular_language_pairs
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )            