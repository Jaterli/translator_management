from django.urls import path
from . import views

urlpatterns = [
    path('api/get_fields/', views.get_model_fields, name='get-fields'),
    path('api/save_query/', views.save_query, name='save-query'),    
    path('api/list_queries/', views.list_queries, name='list-queries'),
    path('api/delete_query/<int:query_id>', views.delete_query, name='delete-query'),
    path('api/execute_query/<int:query_id>/', views.execute_query, name='execute-query'),
    path('api/auth/login/', views.StaffLoginView.as_view(), name='staff-login'),
]
