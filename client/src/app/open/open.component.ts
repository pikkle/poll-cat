import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {PollcatService} from "../services/pollcat.service";
import {ApiService} from "../services/api.service";
import {Subscription} from "rxjs";

@Component({
	selector: 'app-open',
	templateUrl: './open.component.html',
	styleUrls: ['./open.component.css']
})
export class OpenComponent implements OnInit, OnDestroy {
	private roomNameForm: string;
	private audienceCanAskForm: boolean = true;

	private title: string = "Open a new room";

	private sub: Subscription;


	constructor(private router: Router,
	            private apiService: ApiService,
	            private pollcatService: PollcatService) {
		pollcatService.updateTitle(this.title);
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	openRoom(): void {
		if (this.roomNameForm) {
			this.sub = this.apiService.roomCreation.subscribe(room => {
				this.router.navigateByUrl('/room/' + room.id + "/link");
			});
			this.apiService.openRoom(this.roomNameForm, this.audienceCanAskForm);
		}
	}

}
