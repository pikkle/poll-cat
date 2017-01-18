from channels.routing import route, include
from api.consumers import ws_connect, ws_message, ws_disconnect, ws_refuse

channel_routing = [
    route("websocket.connect", ws_connect, path=r"^/join/(?P<room_number>[^/]+)$"),
    route("websocket.connect", ws_refuse),
    route("websocket.receive", ws_message),
    route("websocket.disconnect", ws_disconnect),
]