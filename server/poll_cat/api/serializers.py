from rest_framework import serializers

from api.models import Question, Comment, Room, Poll, Answer


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('message', 'timestamp')


class QuestionSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True)
    id = serializers.IntegerField(source='pk')

    class Meta:
        model = Question
        fields = ('id', 'title', 'timestamp', 'balance', 'comments')


class AnswerSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='pk')

    class Meta:
        model = Answer
        fields = ('id', 'title')


class PollSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='pk')
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Poll
        fields = ('id', 'title', 'isExclusive', 'timestamp', 'answers')


class RoomSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    polls = PollSerializer(many=True)

    class Meta:
        model = Room
        fields = ('title', 'number', 'questions', 'polls')


class RoomSerializerWithToken(serializers.ModelSerializer):
    questions = QuestionSerializer()

    class Meta:
        model = Room
        fields = ('title', 'number', 'token', 'questions')

