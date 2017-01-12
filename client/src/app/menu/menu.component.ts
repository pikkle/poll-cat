import {Component, OnInit} from '@angular/core';
import {PollcatService} from "../services/pollcat.service";
import {Router} from "@angular/router";

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
	private title: string = "Home";

	constructor(
		private router: Router,
		private pollcatService: PollcatService
	) {
		pollcatService.updateTitle(this.title);
	}

	ngOnInit() {
	}

	goToJoin(): void {
		this.router.navigateByUrl('/join');
	}

	goToOpen(): void {
		this.router.navigateByUrl('/open');
	}


}
