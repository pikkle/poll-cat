from channels.routing import route, include
from api.consumers import ws_open, ws_message, ws_disconnect, ws_join, ws_refuse

channel_routing = [
    route("websocket.connect", ws_open, path=r"^/open/(?P<token>[^/]+)$"),
    route("websocket.connect", ws_join, path=r"^/join/(?P<room_number>[^/]+)$"),
    route("websocket.connect", ws_refuse),
    route("websocket.receive", ws_message),
    route("websocket.disconnect", ws_disconnect),
]