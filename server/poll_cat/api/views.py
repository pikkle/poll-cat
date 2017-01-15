from channels import Group
from rest_framework.response import Response
from rest_framework.views import APIView
from uuid import uuid4
from rest_framework.parsers import JSONParser

from api.models import Room, Question, Comment, Vote


class Rooms (APIView):
    def post(self, request):
        json = JSONParser().parse(request)
        uuid = str(uuid4())[:6]
        token = str(uuid4())[:18]
        room = Room(title=json['title'], number=uuid, connected=0, token=token)
        room.save()
        request.session['room_admin_uuid'] = uuid

        return Response({'token': token, 'room': uuid}, status=201)


class Auth (APIView):
    def post(self, request):
        json = JSONParser().parse(request)
        room = Room.objects.filter(token=json['token']).first()
        if room:
            request.session['room_admin_uuid'] = room.number
            return Response({}, status=200)
        else:
            return Response({'error': 'this token is invalid'}, status=403)


class Questions (APIView):
    def post(self, request, room_number):
        json = JSONParser().parse(request)
        room = Room.objects.filter(number=room_number).first()

        if room:
            question = Question(room=room, title=json['title'], balance=0)
            question.save()
            Group("room-%s" % room_number).send({
                "text": {"question": {
                    "title": question.title,
                    "vote": question.balance
                }}
            })

            return Response({"id": question.pk}, status=201)

        else:
            return Response({"error": "no room " + room.number + " found"}, status=404)


class Comments(APIView):
    def post(self, request, question_id):
        json = JSONParser().parse(request)
        question = Question.objects.filter(pk=question_id).first()

        if question:
            comment = Comment(question=question, message=json['message'])
            comment.save()
            return Response({}, status=204)

        else:
            return Response({'error': 'no matching question found'}, status=404)


class Votes(APIView):
    def post(self, request, question_id):
        request.session['a']= "a"
        json = JSONParser().parse(request)
        question = Question.objects.filter(pk=question_id).first()

        print(request.session.user)

        if question:
            vote_set = Question.objects.get(pk=question_id).vote_set.all()

            if request.session in vote_set:
                print('test')

            vote = Vote(question=question, owner=request.session)
            vote.save()
            return Response({}, status=204)

        else:
            return Response({'error': 'no matching question found'}, status=404)



class Polls (APIView):
    def post(self, request, room_number):
        if 'room_admin_uuid' not in request.session or request.session['room_admin_uuid'] != room_number:
            return Response({"error": "you can't post polls for this room"}, status=401)
        else:
            room = Room.objects.filter(number=room_number).first()
            if room:
                Group("room-%s" % room_number).send({
                    "text": 'new poll in the room'
                })

                return Response({}, status=201)

            else:
                return Response({"error": "no room " + room.number + " found"}, status=404)



