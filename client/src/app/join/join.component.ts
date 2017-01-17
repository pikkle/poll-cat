import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PollcatService} from "../services/pollcat.service";
import {SocketService} from "../services/socket.service";

@Component({
	selector: 'app-join',
	templateUrl: './join.component.html',
	styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
	private roomNumberForm: number;
	private title: string = "Join an existing room";

	constructor(private router: Router,
	            private pollcatService: PollcatService) {
		pollcatService.updateTitle(this.title);
	}

	ngOnInit() {
	}

	joinRoom() {
		if (this.roomNumberForm) {
			this.router.navigateByUrl("/room/" + this.roomNumberForm);
		}
	}

}
