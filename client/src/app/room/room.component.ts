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
	private room: Room;
	private roomError: boolean = false;

	private sub: Subscription;

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
		this.sub = this.route.params.subscribe(params => {
			var roomNumber = params['roomNumber'];
			this.pollcatService.updateTitle("");

			this.apiService.questionsReceive.subscribe(qs => {
				this.cards = qs;
			});

			this.socketService.questionReceive.subscribe(q => {
				this.cards.push(q);
			});

			this.socketService.questionUpdate.subscribe(q => {
				for (let c of this.cards) {
					if (c instanceof Question && this.asQuestion(c).id === q.id) {
						console.log(q);
						c.balance = q.balance;
						c.comments = q.comments;
					}
				}
			});

			this.apiService.roomAuth.subscribe(isAdmin => {
				this.isAdmin = isAdmin;
			});

			this.apiService.roomFetch.subscribe(room => {
				this.room = room;
				this.pollcatService.updateTitle(room.title);
				this.apiService.authRoom(room.id);
			});

			this.socketService.roomJoin.subscribe(join => {
				this.apiService.fetchRoom(roomNumber);
			}, error => {
				this.roomError = true;
			});
			this.socketService.joinRoom(roomNumber);
		});

	}

	ngOnDestroy() {
		this.sub.unsubscribe();
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
		this.router.navigateByUrl('/room/'+ this.room.id + '/' + q.id);
	}

	sendQuestion(): void {
		if (this.questionForm) {
			this.apiService.sendQuestion(this.room.id, this.questionForm);
			this.questionForm = '';
		}
	}

}
