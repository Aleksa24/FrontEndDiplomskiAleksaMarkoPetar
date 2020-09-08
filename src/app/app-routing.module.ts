import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {ChannelsComponent} from './components/channels/channels.component';
import {FavouritesComponent} from './components/favourites/favourites.component';
import {AddUserComponent} from './components/add-user/add-user.component';
import {UpdateProfileComponent} from './components/update-profile/update-profile.component';
import {ChannelComponent} from './components/channel/channel.component';
import {MakeChannelComponent} from './components/make-channel/make-channel.component';
import {AuthenticationGuard} from './guard/authentication/authentication.guard';
import {LoginGuard} from './guard/login/login.guard';


const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: 'channels', component: ChannelsComponent, canActivate: [AuthenticationGuard]},
  {path: 'favourites', component: FavouritesComponent, canActivate: [AuthenticationGuard]},
  {path: 'add-user', component: AddUserComponent, canActivate: [AuthenticationGuard]},
  {path: 'make-channel/:id', component: MakeChannelComponent, canActivate: [AuthenticationGuard]},
  {path: 'update-profile', component: UpdateProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'channel/:id', component: ChannelComponent, canActivate: [AuthenticationGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
