import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {RouterModule, Routes} from "@angular/router";
import {RoomlinkComponent} from './roomlink/roomlink.component';
import {TopbarComponent} from './topbar/topbar.component';
import {FootbarComponent} from './footbar/footbar.component';
import {PollcatService} from "./services/pollcat.service";
import { MenuComponent } from './menu/menu.component';
import { JoinComponent } from './join/join.component';
import { OpenComponent } from './open/open.component';

const appRoutes: Routes = [
	{path: '', component: MenuComponent},
	{path: 'open', component: OpenComponent},
	{path: 'join', component: JoinComponent},
	{path: 'roomlink/:roomNumber', component: RoomlinkComponent}
];

@NgModule({
	declarations: [
		AppComponent,
		RoomlinkComponent,
		TopbarComponent,
		FootbarComponent,
		MenuComponent,
		JoinComponent,
		OpenComponent
	],
	imports: [
		RouterModule.forRoot(appRoutes),
		BrowserModule,
		FormsModule,
		HttpModule
	],
	providers: [
		PollcatService,
		SocketService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
