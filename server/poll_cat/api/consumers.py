from channels import Group
from channels.sessions import channel_session
from api.models import Room


@channel_session
def ws_refuse(message):

    print("refuse")

    message.reply_channel.send({"close": True})


@channel_session
def ws_join(message, room_number):

    print("join")

    room = Room.objects.filter(number=room_number).first()

    if room:
        message.reply_channel.send({"accept": True})
        message.channel_session['room'] = room.number
        Group("room-%s" % room.number).add(message.reply_channel)
    else:
        message.reply_channel.send({"close": True})


@channel_session
def ws_open(message, token):

    print("open")
    room = Room.objects.filter(token=token).first()

    if room:
        message.reply_channel.send({"accept": True})
        message.channel_session['room'] = room.number
        message.channel_session['room_admin'] = room.number
        Group("room-%s" % room.number).add(message.reply_channel)
    else:
        message.reply_channel.send({"close": True})


# Connected to websocket.receive
@channel_session
def ws_message(message):

    Group("room-%s" % message.channel_session['room']).send({
        "text": message['text']
    })

# Connected to websocket.disconnect
@channel_session
def ws_disconnect(message):
    Group("room-%s" % message.channel_session['room']).discard(message.reply_channel)
