import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PollcatService} from "../services/pollcat.service";

@Component({
	selector: 'app-open',
	templateUrl: './open.component.html',
	styleUrls: ['./open.component.css']
})
export class OpenComponent implements OnInit {
	private roomNameForm: string;
	private audienceCanAskForm: boolean;

	private title: string = "Open a new room";

	constructor(private router: Router,
	            private pollcatService: PollcatService) {
		pollcatService.updateTitle(this.title);
	}

	ngOnInit() {
	}

}
