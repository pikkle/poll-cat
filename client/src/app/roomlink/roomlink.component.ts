import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {PollcatService} from "../services/pollcat.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {SocketService} from "../services/socket.service";
import {Room} from "../models/room";
import {ApiService} from "../services/api.service";
import {Subscription} from "rxjs";

@Component({
	selector: 'app-roomlink',
	templateUrl: './roomlink.component.html',
	styleUrls: ['./roomlink.component.css']
})
export class RoomlinkComponent implements OnInit, OnDestroy {
	private roomNumber: string;
	private roomError: boolean;

	private subs: Subscription[] = [];

	constructor(private location: Location,
	            private route: ActivatedRoute,
	            private router: Router,
	            private apiService: ApiService,
	            private socketService: SocketService,
	            private pollcatService: PollcatService) {

	}

	ngOnInit() {
		this.subs.push(this.route.params.subscribe(params => {
			this.roomNumber = params['roomNumber'];
			this.pollcatService.updateTitle("");

			this.subs.push(this.apiService.roomFetch.subscribe(room => {
				this.roomNumber = room.id;
				this.pollcatService.updateTitle(room.title);
			}));

			this.subs.push(this.socketService.roomJoin.subscribe(join => {
				this.apiService.fetchRoom(this.roomNumber);
			}, error => {
				this.roomError = true;
			}));
			this.socketService.joinRoom(this.roomNumber);

		}));
	}

	goBack(): void {
		this.router.navigateByUrl('/room/' + this.roomNumber);
	}

	ngOnDestroy() {
		for (let sub of this.subs) {
			sub.unsubscribe();
		}

		this.socketService.closeSocket();
	}

}
