import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {PollcatService} from "../services/pollcat.service";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  private title: string = "Join an existing room";

  constructor(
      private router: Router,
      private pollcatService: PollcatService
  ) {
    pollcatService.updateTitle(this.title);
  }
  ngOnInit() {
  }

}
