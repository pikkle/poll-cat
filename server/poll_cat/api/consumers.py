from channels import Group
from channels.sessions import channel_session
from api.models import Room


@channel_session
def ws_refuse(message):

    print("refuse")

    message.reply_channel.send({"close": True})


@channel_session
def ws_connect(message, room_number):

    print("join")

    room = Room.objects.filter(number=room_number).first()

    if room:
        message.reply_channel.send({"accept": True})
        message.channel_session['room'] = room.number
        Group("room-%s" % room.number).add(message.reply_channel)
    else:
        message.reply_channel.send({"close": True})


@channel_session
def ws_message(message):

    Group("room-%s" % message.channel_session['room']).send({
        "text": message['text']
    })

@channel_session
def ws_disconnect(message):
    Group("room-%s" % message.channel_session['room']).discard(message.reply_channel)
