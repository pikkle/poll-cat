import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable, Subject, ReplaySubject} from "rxjs";
import {Room} from "../models/room";
import {Question} from "../models/question";
import {Poll} from "../models/poll";

@Injectable()
export class SocketService {
	private _message: ReplaySubject<any> = new ReplaySubject();
	public message: Observable<any> = this._message.asObservable();

	private _roomJoin: ReplaySubject<void> = new ReplaySubject<void>();
	public roomJoin: Observable<void> = this._roomJoin.asObservable();

	private _questionReceive: Subject<Question> = new Subject<Question>();
	public questionReceive: Observable<Question> = this._questionReceive.asObservable();

	private _questionUpdate: Subject<Question> = new Subject<Question>();
	public questionUpdate: Observable<Question> = this._questionUpdate.asObservable();

	private _pollReceive: Subject<Poll> = new Subject<Poll>();
	public pollReceive: Observable<Poll> = this._pollReceive.asObservable();

	private _pollUpdate: Subject<Poll> = new Subject<Poll>();
	public pollUpdate: Observable<Poll> = this._pollReceive.asObservable();

	private _socketError: Subject<any> = new Subject();
	public socketError: Observable<any> = this._socketError.asObservable();

	private socket: WebSocket;

	constructor() {

	}

	joinRoom(roomId: string) {
		this.socket = new WebSocket('ws://' + environment.webSocketAddress + '/join/' + roomId);
		this._roomJoin.next(null);
		this.socket.onerror = err => {
			console.error('WEBSOCKET ERROR');
			console.error(err);
			this._socketError.next(err);
		};
		this.socket.onmessage = m => {
			console.log('WEBSOCKET MESSAGE');
			var obj = JSON.parse(m.data);
			console.log(obj);
			var data = obj.data;
			if (obj.type === "question") {
				if (obj.action === "create") {
					this._questionReceive.next(new Question(data.id, data.title, new Date(data.timestamp), data.balance, data.comments));
				} else if (obj.action === "update") {
					this._questionUpdate.next(new Question(data.id, data.title, new Date(data.timestamp), data.balance, data.comments));
				}
			} else if (obj.type === "poll") {
				if (obj.action === "create") {
					var answers = [];
					for (let a of data.answers) {
						answers.push({id: a.id, title: a.title, votes: a.votes});
					}
					this._pollReceive.next(new Poll(data.id, data.title, new Date(data.timestamp), data.isExclusive, answers))
				} else if (obj.action === "update") {
					console.log('received an update');
					var answers = [];
					for (let a of data.answers) {
						answers.push({id: a.id, title: a.title, votes: a.votes});
					}
					this._pollUpdate.next(new Poll(data.id, data.title, new Date(data.timestamp), data.isExclusive, answers))
				}
			}

		}

	}

}