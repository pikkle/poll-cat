from rest_framework import serializers

from api.models import Question, Comment, Room


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('message', 'timestamp')


class QuestionSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True)

    class Meta:
        model = Question
        fields = ('title', 'timestamp', 'balance', 'comments')


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('title', 'number', 'token')

