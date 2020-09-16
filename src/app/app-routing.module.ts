import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {ChannelsComponent} from './components/channels/channels.component';
import {FavouritesComponent} from './components/favourites/favourites.component';
import {AddUserComponent} from './components/add-user/add-user.component';
import {UpdateProfileComponent} from './components/update-profile/update-profile.component';
import {ChannelComponent} from './components/channels/channel/channel.component';
import {MakeChannelComponent} from './components/channels/channel/make-channel/make-channel.component';
import {AuthenticationGuard} from './guard/authentication/authentication.guard';
import {LoginGuard} from './guard/login/login.guard';
import {EditChannelComponent} from './components/edit-channel/edit-channel.component';
import {RoleGuard} from "./guard/role/role.guard";


const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: 'channels', component: ChannelsComponent, canActivate: [AuthenticationGuard]},
  {path: 'favourites', component: FavouritesComponent, canActivate: [AuthenticationGuard]},
  {path: 'add-user', component: AddUserComponent, canActivate: [AuthenticationGuard,RoleGuard]},
  {path: 'make-channel/:id', component: MakeChannelComponent, canActivate: [AuthenticationGuard,RoleGuard]},
  {path: 'edit-channel/:id', component: EditChannelComponent, canActivate: [AuthenticationGuard,RoleGuard]},
  {path: 'update-profile', component: UpdateProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'channel/:id', component: ChannelComponent, canActivate: [AuthenticationGuard,RoleGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
