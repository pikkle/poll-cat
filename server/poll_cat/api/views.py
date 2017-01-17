from json import dumps

from channels import Group
from django.contrib.sessions.models import Session
from rest_framework.response import Response
from rest_framework.views import APIView
from uuid import uuid4
from rest_framework.parsers import JSONParser

from api.models import Room, Question, Comment, Vote, Poll, Answer, get_or_none, AnswerToPoll
from api.serializers import QuestionSerializer, RoomSerializer, PollSerializer


class Rooms (APIView):
    def get(self, request, room_number):
        room = get_or_none(Room, number=room_number)
        if room:
            return Response(RoomSerializer(room).data, status=200)
        else:
            return Response({'error': 'room doesn\'t exist'}, status=403)


    def post(self, request, room_number):
        request.session.save()
        json = JSONParser().parse(request)
        uuid = str(uuid4())[:6]
        token = str(uuid4())[:18]
        room = Room(title=json['title'], number=uuid, connected=0, token=token)
        room.save()
        request.session['room_admin_uuid'] = uuid

        return Response(RoomSerializer(room).data, status=201)


class AnswersToPoll(APIView):
    def post(self, request, room_number, poll_id):
        request.session.save()
        room = get_or_none(Room, number=room_number)
        poll = get_or_none(Poll, pk=poll_id)
        json = JSONParser().parse(request)

        if poll and room and poll.room == room:

            answer_to_poll = get_or_none(AnswerToPoll, owner=request.session, poll=poll)

            if answer_to_poll:
                return Response({'error': 'you have already answered that poll'}, status=403)

            else:
                for answer in json['answers']:

                    db_answer = get_or_none(Answer, pk=answer['id'])

                    if db_answer and db_answer.poll == poll:
                        answer_to_poll = AnswersToPoll(owner=request.session, poll=poll)
                        answer_to_poll.save()

                        if answer['value']:
                            db_answer.value += 1

                        db_answer.save()

                return Response({}, status=204)
        else:
            return Response({'error': 'no matching poll or room found'}, status=404)


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


class AuthForRoom (APIView):
    def get(self, request, room_number):
        request.session.save()
        if 'room_admin_uuid' in request.session:

            room = get_or_none(Room, number=request.session['room_admin_uuid'])
            if room and room.number == room_number:
                return Response({'admin': True}, status=200)
            else:
                return Response({'admin': False}, status=403)

        else:
            return Response({'admin': False}, status=403)


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

            Group('room-%s' % question.room.number).send({
                'text': dumps({
                    'type': 'question',
                    'action': 'create',
                    'data': QuestionSerializer(question).data
                })
            })

            return Response(QuestionSerializer(question).data, status=201)

        else:
            return Response({"error": "no room " + room_number + " found"}, status=404)


class Comments(APIView):
    def post(self, request, room_number, question_id):
        request.session.save()
        json = JSONParser().parse(request)
        question = Question.objects.filter(pk=question_id).first()

        if question and question.room.number == room_number:
            comment = Comment(question=question, message=json['message'])
            comment.save()

            Group('room-%s' % question.room.number).send({
                'text': dumps({
                    'type': 'question',
                    'action': 'update',
                    'data': QuestionSerializer(question).data
                })
            })

            return Response({}, status=204)

        else:
            return Response({'error': 'no matching question found'}, status=404)


class Votes(APIView):
    def post(self, request, room_number, question_id):
        request.session.save()
        session = Session.objects.get(session_key=request.session.session_key)
        json = JSONParser().parse(request)
        question = Question.objects.filter(pk=question_id).first()

        if question and question.room.number == room_number:
            vote = Question.objects.get(pk=question_id).vote_set.filter(owner=session).all().first()

            if vote:
                return Response({'error': 'you have already vote for this question'}, status=403)
            else:
                vote = Vote(question=question, owner=session)
                vote.save()

                value = int('0' + json['value'])

                if value > 1:
                    question.balance += 1
                elif value < -1:
                    question.balance -= 1

                Group('room-%s' % question.room.number).send({
                    'text': dumps({
                        'type': 'question',
                        'action': 'update',
                        'data': QuestionSerializer(question).data
                    })
                })

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

                    Group('room-%s' % poll.room.number).send({
                        'text': dumps({
                            'type': 'poll',
                            'action': 'create',
                            'data': PollSerializer(poll).data
                        })
                    })

                return Response({}, status=201)

            else:
                return Response({"error": "no room " + room.number + " found"}, status=404)



