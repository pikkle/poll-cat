from django.db import models

# Create your models here.
from django.db.models import Model


class Room (Model):
    number = models.CharField(max_length=6)
    token = models.CharField(max_length=18)
    title = models.CharField(max_length=50)
    connected = models.IntegerField()

    def __str__(self):
        return self.title


class Question (Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    timestamp = models.DateField(auto_now_add=True)
    vote = models.IntegerField()


class Comment (Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateField(auto_now_add=True)


class Poll (Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    isExclusive = models.BooleanField()


class Answers (Model):
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    votes = models.IntegerField()


