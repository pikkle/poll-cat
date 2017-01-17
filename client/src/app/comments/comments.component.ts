import {Component, OnInit} from '@angular/core';
import {PollcatService} from "../services/pollcat.service";
import {ApiService} from "../services/api.service";
import {SocketService} from "../services/socket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Question} from "../models/question";
import {Comment} from "../models/comment";
import {Room} from "../models/room";

@Component({
	selector: 'app-comments',
	templateUrl: './comments.component.html',
	styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
	private room: Room;
	private comments: Comment[];
	private question: Question;

	private formComment: string = '';

	constructor(private router: Router,
	            private route: ActivatedRoute,
	            private apiService: ApiService,
	            private socketService: SocketService,
	            private pollcatService: PollcatService) {
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			var roomNumber = params['roomNumber'];
			var questionId = +params['questionId'];
			this.pollcatService.updateTitle("");

			this.socketService.questionUpdate.subscribe(q => {
				if (q.id === questionId) {
					this.comments = [];
					for (let c of q.comments) {
						this.comments.push(new Comment(c.message, c.timestamp));
					}
				}

			});

			this.apiService.roomFetch.subscribe(room => {
				this.room = room;
				var question = room.questions.find(q => q.id === questionId);
				this.question = question;
				this.comments = [];
				for (let c of question.comments) {
					this.comments.push(new Comment(c.message, c.timestamp));
				}
				this.pollcatService.updateTitle(question.title);
			});

			this.socketService.roomJoin.subscribe(join => {
				this.apiService.fetchRoom(roomNumber);
			}, error => {
			});
			this.socketService.joinRoom(roomNumber);
		});
	}

	sendComment() {
		if (this.formComment) {
			this.apiService.sendComment(this.room.id, this.question.id, this.formComment);
			this.formComment = '';
		}
	}

	commentsReversed(): Comment[] {
		if (!this.comments) {
			return [];
		} else {
			return this.comments.reverse();
		}
	}

	goBack(): void {
		this.router.navigateByUrl('/room/' + this.room.id);
	}

	prettyTimestamp(date: Date): string {
		return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	}

}
