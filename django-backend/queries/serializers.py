from rest_framework import serializers
from .models import CustomQuery, QueryCondition

class QueryConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QueryCondition
        fields = ['field', 'operator', 'value', 'logical_operator']

class CustomQuerySerializer(serializers.ModelSerializer):
    conditions = QueryConditionSerializer(many=True)

    class Meta:
        model = CustomQuery
        fields = ['id', 'name', 'conditions']
