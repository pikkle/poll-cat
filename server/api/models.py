import json

from django.contrib.sessions.models import Session
from django.db import models

# Create your models here.
from django.db.models import Model
from requests.auth import HTTPBasicAuth
import requests


def get_or_none(classmodel, **kwargs):
    try:
        return classmodel.objects.get(**kwargs)
    except classmodel.DoesNotExist:
        return None


class Room (Model):
    number = models.CharField(max_length=6)
    token = models.CharField(max_length=18)
    title = models.CharField(max_length=50)
    connected = models.IntegerField()

    def __str__(self):
        return self.title

    def questions(self):
        return self.question_set.order_by('timestamp')

    def polls(self):
        return self.poll_set.order_by('timestamp')


class Question (Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    owner = models.ForeignKey(Session)
    title = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    balance = models.IntegerField()

    def comments(self):
        return self.comment_set.all()

    def level(self):
        user = get_or_none(User, session=self.owner)

        resp = requests.get('http://localhost:8888/users/' + self.owner.session_key, auth=HTTPBasicAuth('pollcat', 'pollcat'))
        data = json.loads(resp.text)

        print(data)

        if user:
            return data['level']['name']
        else:
            return 'level 0'

    def username(self):
        user = get_or_none(User, session=self.owner)
        if user:
            return user.username
        else:
            return 'Anonymous'


class Vote (Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    owner = models.ForeignKey(Session)


class Comment (Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


class Poll (Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    isExclusive = models.BooleanField()

    def answers(self):
        return self.answer_set


class Answer (Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    votes = models.IntegerField()


class AnswerToPoll (Model):
    poll = models.ForeignKey(Poll)
    owner = models.ForeignKey(Session)


class AnswerToAnswer (Model):
    answer = models.ForeignKey(Answer)
    owner = models.ForeignKey(Session)


class User (Model):
    session = models.ForeignKey(Session)
    username = models.CharField(max_length=50)

