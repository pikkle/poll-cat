import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable, Subject, ReplaySubject} from "rxjs";
import {Room} from "../models/room";

@Injectable()
export class SocketService {
	private _message: ReplaySubject<any> = new ReplaySubject();
	public message: Observable<any> = this._message.asObservable();

	private _roomJoin: ReplaySubject<void> = new ReplaySubject<void>();
	public roomJoin: Observable<void> = this._roomJoin.asObservable();

	private _socketError: Subject<any> = new Subject();
	public socketError: Observable<any> = this._socketError.asObservable();

	private socket: WebSocket;

	constructor() {

	}

	joinRoom(roomId: string) {
		this.socket = new WebSocket('ws://' + environment.apiAddress + '/join/' + roomId);
		this._roomJoin.next(null);
		this.socket.onerror = err => {
			console.log(err);
			this._socketError.next(err);
		};
		this.socket.onmessage = m => {
			console.log(m);
		}

	}

}