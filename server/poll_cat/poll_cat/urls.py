
from django.conf.urls import url
from django.contrib import admin

from api import views
from api.views import Rooms

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^rooms$', views.Rooms.as_view()),
    url(r'^rooms/auth', views.Auth.as_view()),
    url(r'^rooms/(?P<room_number>[^/]+)/questions$', views.Questions.as_view()),
    url(r'^rooms/(?P<room_number>[^/]+)/polls', views.Polls.as_view()),

]
