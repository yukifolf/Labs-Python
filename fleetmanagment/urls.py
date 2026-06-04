from django.contrib import admin
from django.http import FileResponse, Http404
from django.conf import settings
from django.urls import path, include, re_path


def spa_view(request):
    index = settings.BASE_DIR / 'frontend' / 'dist' / 'index.html'
    if not index.exists():
        raise Http404('React build not found — run: cd frontend && npm run build')
    return FileResponse(open(index, 'rb'), content_type='text/html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('app.User.urls')),
    re_path(r'^(?!api/).*$', spa_view, name='spa'),
]
