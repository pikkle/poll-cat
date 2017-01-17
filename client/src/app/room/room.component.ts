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

			this.apiService.roomFetch.subscribe(room => {
				this.room = room;
				this.pollcatService.updateTitle(room.title);
			});

			this.socketService.roomJoin.subscribe(join => {
				console.log("Socket opened");
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
		if (!this.hasVoted) {
			q.vote--;
			this.hasVoted = true;
		}
	}

	upvote(q: Question): void {
		if (!this.hasVoted) {
			q.vote++;
			this.hasVoted = true;
		}
	}

	goToComments(q: Question): void {

	}

	sendQuestion(): void {
		console.log("1");
		if (this.questionForm) {
			console.log("2");
			this.apiService.questionReceive.subscribe(q => {
				console.log("3");
				console.log(q);
			});
			console.log("4");
			this.apiService.sendQuestion(this.room.id, this.questionForm);
		}
	}

}
