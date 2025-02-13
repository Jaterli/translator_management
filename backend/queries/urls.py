from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('api/get_fields/', views.GetModelFieldsView.as_view(), name='get-fields'),
    path('api/save_query/', views.SaveQueryView.as_view(), name='save-query'),    
    path('api/list_queries/', views.ListQueriesView.as_view(), name='list-queries'),
    path('api/delete_query/<int:query_id>/', views.DeleteQueryView.as_view(), name='delete-query'),
    path('api/execute_query/<int:query_id>/', views.ExecuteQueryView.as_view(), name='execute-query'),
    path('api/auth/login/', views.StaffLoginView.as_view(), name='staff-login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint para refrescar token    
]
