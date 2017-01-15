from channels import Group
from django.contrib.sessions.models import Session
from rest_framework.response import Response
from rest_framework.views import APIView
from uuid import uuid4
from rest_framework.parsers import JSONParser

from api.models import Room, Question, Comment, Vote, Poll, Answer
from api.serializers import QuestionSerializer


class Rooms (APIView):
    def post(self, request):
        request.session.save()
        json = JSONParser().parse(request)
        uuid = str(uuid4())[:6]
        token = str(uuid4())[:18]
        room = Room(title=json['title'], number=uuid, connected=0, token=token)
        room.save()
        request.session['room_admin_uuid'] = uuid

        return Response({'token': token, 'room': uuid}, status=201)


class Auth (APIView):
    def post(self, request):
        request.session.save()
        json = JSONParser().parse(request)
        room = Room.objects.filter(token=json['token']).first()
        if room:
            request.session['room_admin_uuid'] = room.number
            return Response({}, status=200)
        else:
            return Response({'error': 'this token is invalid'}, status=403)


class Questions (APIView):
    def get(self, request, room_number):
        request.session.save()
        questions = Room.objects.get(number=room_number).question_set.all()
        json = QuestionSerializer(questions, many=True)
        return Response(json.data, status=200)

    def post(self, request, room_number):
        request.session.save()
        json = JSONParser().parse(request)
        room = Room.objects.filter(number=room_number).first()

        if room:
            question = Question(room=room, title=json['title'], balance=0)
            question.save()
            questionJson = QuestionSerializer(question)

            Group("room-%s" % room_number).send({
                "text": str(questionJson.data)
            })

            return Response({"id": question.pk}, status=201)

        else:
            return Response({"error": "no room " + room.number + " found"}, status=404)


class Comments(APIView):
    def post(self, request, question_id):
        request.session.save()
        json = JSONParser().parse(request)
        question = Question.objects.filter(pk=question_id).first()

        if question:
            comment = Comment(question=question, message=json['message'])
            comment.save()
            Group("room-%s" % question.room.number).send({
                "text": str(QuestionSerializer(question).data)
            })
            return Response({}, status=204)

        else:
            return Response({'error': 'no matching question found'}, status=404)


class Votes(APIView):
    def post(self, request, question_id):
        request.session.save()
        session = Session.objects.get(session_key=request.session.session_key)
        json = JSONParser().parse(request)
        question = Question.objects.filter(pk=question_id).first()

        if question:
            vote = Question.objects.get(pk=question_id).vote_set.filter(owner=session).all().first()

            if vote:
                return Response({'error': 'you have already vote for this question'}, status=403)
            else:
                vote = Vote(question=question, owner=session)
                vote.save()
                return Response({}, status=204)

        else:
            return Response({'error': 'no matching question found'}, status=404)


class Polls (APIView):
    def post(self, request, room_number):
        request.session.save()
        if 'room_admin_uuid' not in request.session or request.session['room_admin_uuid'] != room_number:
            return Response({"error": "you can't post polls for this room"}, status=401)
        else:
            room = Room.objects.filter(number=room_number).first()
            if room:
                json = JSONParser().parse(request)
                poll = Poll(room=room, title=json['title'], isExclusive=json['isExclusive'])
                poll.save()

                for item in json['answers']:
                    answer = Answer(poll=poll, title=item['title'], votes=0)
                    answer.save()

                return Response({}, status=201)

            else:
                return Response({"error": "no room " + room.number + " found"}, status=404)



