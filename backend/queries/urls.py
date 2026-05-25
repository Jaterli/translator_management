from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('get-fields/', views.GetModelFieldsView.as_view(), name='get_fields'),
    path('save-query/', views.SaveQueryView.as_view(), name='save_query'),    
    path('list-queries/', views.ListQueriesView.as_view(), name='list_queries'),
    path('delete-query/<int:query_id>/', views.DeleteQueryView.as_view(), name='delete_query'),
    path('execute-query/<int:query_id>/', views.ExecuteQueryView.as_view(), name='execute_query'),
    path('auth/login/', views.StaffLoginView.as_view(), name='staff_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint para refrescar token    
    path('translator-detail/<int:id>/', views.TranslatorDetailViewForAdmin.as_view(), name='translator_detail'),

]
