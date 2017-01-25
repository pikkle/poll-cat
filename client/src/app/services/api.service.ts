import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {environment} from "../../environments/environment";
import {Observable, Subject} from "rxjs";
import {Room} from "../models/room";
import {Question} from "../models/question";
import {Comment} from "../models/comment";
import {Poll} from "../models/poll";

@Injectable()
export class ApiService {
	private apiUrl = 'api';
	private jsonHeader = new Headers({'Content-Type': 'application/json'});

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
				for (let q of d.questions) {
					var comments: Comment[] = [];
					for (let c of q.comments) {
						comments.push(new Comment(c.message, new Date(c.timestamp)));
					}
					questions.push(new Question(q.id, q.title, new Date(q.timestamp), q.balance, comments));
				}

				var polls: Poll[] = [];
				for (let q of d.polls) {
					var answers = [];
					for (let a of q.answers) {
						answers.push({id: a.id, title: a.title, votes: a.votes});
					}
					polls.push(new Poll(q.id, q.title, new Date(q.timestamp), q.isExclusive, answers));
				}

				this._roomFetch.next(new Room(d.number, d.title, questions, polls));
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
			.subscribe(data => {});
	}

	vote(roomId: string, questionId: number, value: number) {
		const path = this.apiUrl + '/rooms/' + roomId + '/questions/' + questionId + '/votes';
		const data = {'value': value};
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.post(path, JSON.stringify(data), options)
			.subscribe(data => {});
	}

	sendComment(roomId: string, questionId: number, comment: string) {
		const path = this.apiUrl + '/rooms/' + roomId + '/questions/' + questionId + '/comments';
		const data = {'message': comment};
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.post(path, JSON.stringify(data), options)
			.subscribe(data => {});
	}

	sendPoll(roomId: string, pollName: string, answers: any[], isExclusive: boolean) {
		const path = this.apiUrl + '/rooms/' + roomId + '/polls';
		const data = {title: pollName, answers: answers, isExclusive: isExclusive};
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.post(path, JSON.stringify(data), options)
			.subscribe(data => {});
	}

	sendAnswer(roomId: string, pollId: number, answers: any[]) {
		const path = this.apiUrl + '/rooms/' + roomId + '/polls/' + pollId + '/answers';
		const data = answers;
		const options = new RequestOptions({headers: this.jsonHeader});
		this.http.post(path, JSON.stringify(data), options)
			.subscribe(data => {
				console.log(data);
			});
	}
}