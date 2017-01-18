import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {PollcatService} from "../services/pollcat.service";
import {Room} from "../models/room";
import {Question} from "../models/question";
import {Poll} from "../models/poll";
import {Subscription} from "rxjs";
import {ApiService} from "../services/api.service";
import {SocketService} from "../services/socket.service";

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {
	private questionForm: string;
	private pollQuestionForm: string;
	private pollAnswerForm = [{value: ''}, {value: ''}];
	private isExclusiveForm: string;

	private pollAnswersRadio = {};
	private pollAnswersCheckbox = {};


	private room: Room;
	private roomError: boolean = false;

	private subs: Subscription[] = [];

	private hasVoted: boolean = false;

	private isAdmin: boolean = false;

	private cards: any[] = []; // Questions or Polls

	constructor(private router: Router,
	            private route: ActivatedRoute,
	            private apiService: ApiService,
	            private socketService: SocketService,
	            private pollcatService: PollcatService) {

	}

	ngOnInit() {
		this.subs.push(this.route.params.subscribe(params => {
			var roomNumber = params['roomNumber'];
			this.pollcatService.updateTitle("");

			this.subs.push(this.socketService.questionReceive.subscribe(q => {
				this.cards.push(q);
			}));

			this.subs.push(this.socketService.questionUpdate.subscribe(q => {
				for (let c of this.cards) {
					if (c instanceof Question && this.asQuestion(c).id === q.id) {
						console.log(q);
						c.balance = q.balance;
						c.comments = q.comments;
					}
				}
			}));

			this.subs.push(this.socketService.pollReceive.subscribe(p => {
				this.cards.push(p);
				if (p.isExclusive) {
					this.pollAnswersRadio[p.id] = {value: ''}
				} else {
					var answers = {};
					for (let a of p.answers) {
						answers[a.id] = {value: false};
					}
					this.pollAnswersCheckbox[p.id] = answers;
				}
			}));

			this.subs.push(this.apiService.roomAuth.subscribe(isAdmin => {
				this.isAdmin = isAdmin;
			}));

			this.subs.push(this.apiService.roomFetch.subscribe(room => {
				this.room = room;
				this.cards = room.questions;
				this.cards = this.cards.concat(room.polls);

				for (let p of room.polls) {
					if (p.isExclusive) {
						this.pollAnswersRadio[p.id] = {value: ''}
					} else {
						var answers = {};
						for (let a of p.answers) {
							answers[a.id] = {id: a.id, value: false};
						}
						this.pollAnswersCheckbox[p.id] = answers;
					}
				}

				this.pollcatService.updateTitle(room.title);
				this.apiService.authRoom(room.id);
			}));

			this.subs.push(this.socketService.roomJoin.subscribe(join => {
				this.apiService.fetchRoom(roomNumber);
			}, error => {
				this.roomError = true;
			}));
			this.socketService.joinRoom(roomNumber);
		}));

	}

	ngOnDestroy() {
		for (let sub of this.subs) {
			sub.unsubscribe();
		}
	}

	isQuestion(card: any): boolean {
		return card instanceof Question;
	}

	isPoll(card: any): boolean {
		return card instanceof Poll;
	}

	asQuestion(card: any): Question {
		if (this.isQuestion(card)) {
			return <Question> card;
		} else {
			throw new Error("Could not cast card to a Question");
		}
	}

	asPoll(card: any): Poll {
		if (this.isPoll(card)) {
			return <Poll> card;
		} else {
			throw new Error("Could not cast card to a Question");
		}
	}

	downvote(q: Question): void {
		this.apiService.vote(this.room.id, q.id, -1);
	}

	upvote(q: Question): void {
		this.apiService.vote(this.room.id, q.id, 1);
	}

	goToComments(q: Question): void {
		this.router.navigateByUrl('/room/' + this.room.id + '/comments/' + q.id);
	}

	goToStats(p: Poll): void {
		this.router.navigateByUrl('/room/' + this.room.id + '/stats/' + p.id);
	}

	openRoomLink(): void {
		this.router.navigateByUrl('/room/' + this.room.id + '/link');
	}

	sendQuestion(): void {
		if (this.questionForm) {
			this.apiService.sendQuestion(this.room.id, this.questionForm);
			this.questionForm = '';
		}
	}

	addAnswer(): void {
		this.pollAnswerForm.push({value: ''});
	}

	sendPoll(): void {
		if (this.isExclusiveForm && this.pollQuestionForm && this.pollAnswerForm[0].value !== '' && this.pollAnswerForm[1].value !== '') {
			var isExclusive = this.isExclusiveForm === 'true';
			var answers: any[] = [];
			for (let a of this.pollAnswerForm) {
				if (a.value) answers.push({'title': a.value});
			}
			this.apiService.sendPoll(this.room.id, this.pollQuestionForm, answers, isExclusive);
			this.pollQuestionForm = '';
			this.pollAnswerForm = [{value: ''}, {value: ''}];
		}
	}

	answerPoll(p: Poll): void {
		var answers = [];
		if (p.isExclusive) {
			answers.push({id: +this.pollAnswersRadio[p.id].value, vote: true});
		} else {
			for (var a in this.pollAnswersCheckbox[p.id]) {
				if (this.pollAnswersCheckbox[p.id].hasOwnProperty(a)) {
					answers.push({id: this.pollAnswersCheckbox[p.id][a].id, vote: this.pollAnswersCheckbox[p.id][a].value});
				}
			}
		}
		this.apiService.sendAnswer(this.room.id, p.id, answers);
	}

}
