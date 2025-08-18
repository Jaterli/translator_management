from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('api/get-fields/', views.GetModelFieldsView.as_view(), name='get_fields'),
    path('api/save-query/', views.SaveQueryView.as_view(), name='save_query'),    
    path('api/list-queries/', views.ListQueriesView.as_view(), name='list_queries'),
    path('api/delete-query/<int:query_id>/', views.DeleteQueryView.as_view(), name='delete_query'),
    path('api/execute-query/<int:query_id>/', views.ExecuteQueryView.as_view(), name='execute_query'),
    path('api/auth/login/', views.StaffLoginView.as_view(), name='staff_login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint para refrescar token    
]
