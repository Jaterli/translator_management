from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
# from django.contrib.auth import views as auth_views
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('', include('translators.urls')),
    path('admin/', admin.site.urls),    
    #path('translators/', include('translators.urls')),    
    path('accounts/logout/', LogoutView.as_view(next_page='login'), name='logout'),
    path('queries/', include('queries.urls')),    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
