import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {environment} from "../../environments/environment";
import {Observable, Subject} from "rxjs";
import {Room} from "../models/room";
import {Question} from "../models/question";
import {Comment} from "../models/comment";

@Injectable()
export class ApiService {
	private apiUrl = 'http://' + environment.apiAddress;
	private jsonHeader = new Headers({'Content-Type': 'application/json'});

	private _questionsReceive: Subject<Question[]> = new Subject<Question[]>();
	public questionsReceive: Observable<Question[]> = this._questionsReceive.asObservable();

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
				var questions: Question[] = [];
				console.log(d.questions);
				for (let q of d.questions) {
					var comments: Comment[] = [];
					for (let c of q.comments) {
						comments.push(new Comment(c.message, new Date(c.timestamp)));
					}

					questions.push(new Question(q.id, q.title, new Date(q.timestamp), q.balance, comments));
				}
				this._roomFetch.next(new Room(d.number, d.title, questions, []));

				this._questionsReceive.next(questions);
			});
	}

	openRoom(roomName: string, openQuestions: boolean) {
		const path = this.apiUrl + '/rooms';
		const data = {'title': roomName, 'openQuestions': openQuestions};
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.post(path, JSON.stringify(data), options)
			.subscribe(data => {
				var d = this.extractData(data);
				this._roomCreation.next(new Room(d.number, d.title, [], []));
			});
	}

	sendQuestion(roomId: string, title: string) {
		const path = this.apiUrl + '/rooms/' + roomId + '/questions';
		const data = {'title': title};
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.post(path, JSON.stringify(data), options)
			.subscribe(data => {
				var d = this.extractData(data);
			});
	}

	vote(roomId: string, questionId: number, value: number) {
		const path = this.apiUrl + '/rooms/' + roomId + '/questions/' + questionId + '/votes';
		const data = {'value': value};
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.post(path, JSON.stringify(data), options)
			.subscribe(data => {
				var d = this.extractData(data);
			});
	}

	sendComment(roomId: string, questionId: number, comment: string) {
		const path = this.apiUrl + '/rooms/' + roomId + '/questions/' + questionId + '/comments';
		const data = {'message': comment};
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.post(path, JSON.stringify(data), options)
			.subscribe(data => {
				var d = this.extractData(data);
			});
	}
}