from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from queries.models import SavedQuery
from translators.models import Translator, ProfessionalProfile, LanguageCombination
from django.db.models import Q
from django.apps import apps
import json


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
    queries = SavedQuery.objects.values("id", "name", "created_at")
    return JsonResponse({"queries": list(queries)})


@csrf_exempt
def delete_query(request, query_id):
    if request.method == "DELETE":
        query = get_object_or_404(SavedQuery, id=query_id)
        query.delete()
        return JsonResponse({"message": "Query deleted successfully."})
    return JsonResponse({"error": "Invalid request method."}, status=400)


from django.core.serializers.json import DjangoJSONEncoder
from django.forms.models import model_to_dict
from django.db.models import FileField, ImageField

def serialize_instance(instance, exclude_fields=None):
    """
    Convierte una instancia de modelo en un diccionario serializable a JSON.
    Permite excluir campos específicos definidos en exclude_fields.
    """
    if exclude_fields is None:
        exclude_fields = {}

    model_name = instance._meta.model_name
    excluded = exclude_fields.get(model_name, [])

    instance_dict = model_to_dict(instance, exclude=excluded)
    for field in instance._meta.fields:
        field_name = field.name
        field_value = getattr(instance, field_name)

        if field_name in excluded:
            continue  # Saltar campos excluidos

        if isinstance(field, (FileField, ImageField)):
            # Reemplazar el FieldFile con su URL o None si no hay archivo
            instance_dict[field_name] = field_value.url if field_value else None

    return instance_dict

def execute_query(request, query_id):
    try:
        # Obtener la consulta guardada
        saved_query = SavedQuery.objects.get(id=query_id)
        query_criteria = saved_query.query

        # Definir campos a excluir para cada modelo
        exclude_fields = {
            'translator': ['password','is_superuser','is_active','is_staff','groups','user_permissions'],
            'professionalprofile': [],
            'languagecombination': [],
        }
        # Diccionario para almacenar filtros acumulativos por modelo
        filters_by_model = {}

        # Procesar cada condición en la consulta guardada
        print("query_criteria: ", query_criteria)
        for condition in query_criteria:

            model_name = condition['model']
            field = condition['field']
            operator = condition['operator']
            value = condition['value']
            logical = condition.get('logical', None)

            # Obtener el modelo dinámicamente
            Model = apps.get_model(app_label='translators', model_name=model_name)
            if Model is None:
                print("MODELO NO ENCONTRADO")
                return JsonResponse({"error": f"Modelo {model_name} no encontrado"}, status=400)

            # Crear la condición de filtro
            filter_condition = Q()
            if operator == '=':
                filter_condition = Q(**{field: value})
            elif operator == '!=':
                filter_condition = ~Q(**{field: value})
            elif operator == '<':
                filter_condition = Q(**{f"{field}__lt": value})
            elif operator == '<=':
                filter_condition = Q(**{f"{field}__lte": value})
            elif operator == '>':
                filter_condition = Q(**{f"{field}__gt": value})
            elif operator == '>=':
                filter_condition = Q(**{f"{field}__gte": value})
            elif operator == 'LIKE':
                filter_condition = Q(**{f"{field}__icontains": value})
            elif operator == 'NOT LIKE':
                filter_condition = ~Q(**{f"{field}__icontains": value})
            
            # Acumular filtros por modelo
            if logical is None:
                filters_by_model[model_name] = filter_condition

            else:
                if model_name not in filters_by_model:
                    filters_by_model[model_name] = Q()

                if logical == 'AND':
                    filters_by_model[model_name] &= filter_condition
                elif logical == 'OR':
                    filters_by_model[model_name] |= filter_condition
        
            print("Condition: ",condition)
            print("filter_condition: ",filter_condition)
            print("filters_by_model[model_name]: ",filters_by_model[model_name],"\n")

        # Ejecutar consultas para cada modelo y estructurar los resultados
        combined_results = []
        for model_name, filter_condition in filters_by_model.items():
            Model = apps.get_model(app_label='translators', model_name=model_name)
            #print("Model: ",Model,"\n")


            print("filter_condition: ",filter_condition,"\n")
            queryset = Model.objects.filter(filter_condition)
            #print("queryset: ",queryset,"")
            for obj in queryset:
                obj_dict = serialize_instance(obj, exclude_fields=exclude_fields)  # Pasar exclusiones

                #combined_results.append({model_name: obj_dict})

                # Verificar relaciones (FK, OneToOne y Reverse FK)
                related_results = []
                for related in Model._meta.related_objects:
                    related_name = related.get_accessor_name()
                    related_set_or_obj = getattr(obj, related_name, None)

                    if related.many_to_one or related.one_to_one:
                        # Relación FK o OneToOne
                        if related_set_or_obj:
                            obj_dict[related.related_model.__name__] = serialize_instance(related_set_or_obj, exclude_fields=exclude_fields)
                            #related_results.append(serialize_instance(related_set_or_obj, exclude_fields=exclude_fields))

                    elif related.one_to_many or related.many_to_many:
                        # Relación Reverse FK o ManyToMany
                        if related_set_or_obj.exists():
                            obj_dict[related.related_model.__name__] = [
                                serialize_instance(rel_obj, exclude_fields=exclude_fields) for rel_obj in related_set_or_obj.all()
                            ]
                            # related_results.append([
                            #      serialize_instance(rel_obj, exclude_fields=exclude_fields) for rel_obj in related_set_or_obj.all()
                            #  ])

                combined_results.append({model_name: obj_dict})

        return JsonResponse({"results": combined_results}, encoder=DjangoJSONEncoder)

    except SavedQuery.DoesNotExist:
        return JsonResponse({"error": "Consulta no encontrada"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
