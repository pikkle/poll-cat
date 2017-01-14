from channels import Group
from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView
from uuid import uuid4
from rest_framework.parsers import JSONParser

from api.models import Room


class Rooms (APIView):
    def post(self, request):
        json = JSONParser().parse(request)
        uuid = str(uuid4())[:6]
        token = str(uuid4())[:18]
        room = Room(title=json['title'], uuid=uuid, connected=0, token=token)
        request.session['room_admin_uuid'] = uuid

        return Response({'token': token, 'room': uuid}, status=201)

class Question (APIView):
    def post(self, request):
        room = 111111
        Group("room-%s" % 111111).send({
            "text": 'ok'
        })

        return Response({}, status=201)

