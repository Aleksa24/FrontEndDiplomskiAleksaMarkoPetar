import { NgModule } from '@angular/core';

import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {ChannelsComponent} from "./components/channels/channels.component";
import {FavouritesComponent} from "./components/favourites/favourites.component";
import {AddUserComponent} from "./components/add-user/add-user.component";
import {ChannelComponent} from "./component/channel/channel.component";



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'channels', component: ChannelsComponent },
  { path: 'favourites', component: FavouritesComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'channel/:id', component: ChannelComponent },
  { path: '', redirectTo: "/login", pathMatch: "full"},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
