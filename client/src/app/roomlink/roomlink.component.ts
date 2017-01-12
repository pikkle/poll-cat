import {Component, OnInit, Input} from '@angular/core';
import {PollcatService} from "../services/pollcat.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
	selector: 'app-roomlink',
	templateUrl: './roomlink.component.html',
	styleUrls: ['./roomlink.component.css']
})
export class RoomlinkComponent implements OnInit {
	private roomNumber: number;
	private title: string = "Placeholder for Room Name";

	constructor(private location: Location,
	            private route: ActivatedRoute,
	            private router: Router,
	            private pollcatService: PollcatService) {
		pollcatService.updateTitle(this.title);
	}

	ngOnInit() {
		this.roomNumber = this.route.snapshot.params['roomNumber']; //TODO: check that user has control over selected room (if he has it in his rooms list)

	}

	goBack(): void {
		this.location.back();
	}

}
