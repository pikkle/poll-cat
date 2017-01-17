import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PollcatService} from "../services/pollcat.service";
import {ApiService} from "../services/api.service";

@Component({
	selector: 'app-open',
	templateUrl: './open.component.html',
	styleUrls: ['./open.component.css']
})
export class OpenComponent implements OnInit {
	private roomNameForm: string;
	private audienceCanAskForm: boolean = true;

	private title: string = "Open a new room";

	constructor(private router: Router,
	            private apiService: ApiService,
	            private pollcatService: PollcatService) {
		pollcatService.updateTitle(this.title);
	}

	ngOnInit() {
	}

	openRoom(): void {
		if (this.roomNameForm) {
			this.apiService.roomCreation.subscribe(room => {
				this.router.navigateByUrl('/room/' + room.id + "/link");
			});
			this.apiService.openRoom(this.roomNameForm, this.audienceCanAskForm);
		}
	}

}
