import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {environment} from "../../environments/environment";
import {Observable, Subject} from "rxjs";
import {Room} from "../models/room";
import {Question} from "../models/question";

@Injectable()
export class ApiService {
	private apiUrl = 'http://' + environment.apiAddress;
	private jsonHeader = new Headers({'Content-Type': 'application/json'});
	private token: string;

	private _questionReceive: Subject<Question> = new Subject<Question>();
	public questionReceive: Observable<Question> = this._questionReceive.asObservable();

	private _roomCreation: Subject<Room> = new Subject<Room>();
	public roomCreation: Observable<Room> = this._roomCreation.asObservable();

	private _roomFetch: Subject<Room> = new Subject<Room>();
	public roomFetch: Observable<Room> = this._roomFetch.asObservable();

	private _roomAuth: Subject<boolean> = new Subject<boolean>();
	public roomAuth: Observable<boolean> = this._roomAuth.asObservable();

	constructor(private http: Http) {
	}

	private extractData(res: Response) {
		let body = res.json();
		return body || {};
	}

	private handleError(error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}

	authRoom(roomId: string) {
		const path = this.apiUrl + '/rooms/' + roomId + '/auth';
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.get(path, options)
			.subscribe(data => {
				var d = this.extractData(data);
				this._roomAuth.next(d.admin);
			});
	}

	fetchRoom(roomId: string) {
		const path = this.apiUrl + '/rooms/' + roomId;
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.get(path, options)
			.subscribe(data => {
				var d = this.extractData(data);
				this._roomFetch.next(new Room(d.number, d.title));
			});
	}

	openRoom(roomName: string, openQuestions: boolean) {
		const path = this.apiUrl + '/rooms';
		const data = {'title': roomName, 'openQuestions': openQuestions};
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.post(path, JSON.stringify(data), options)
			.subscribe(data => {
				var d = this.extractData(data);
				console.log(data);
				this.token = d.token;
				this._roomCreation.next(new Room(d.number, d.title));
			});
	}

	sendQuestion(roomId: string, title: string) {
		const path = this.apiUrl + '/rooms/' + roomId + '/questions';
		const data = {'title': title};
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.post(path, JSON.stringify(data), options)
			.subscribe(data => {
				var d = this.extractData(data);
				console.log(d);
			});
	}

}