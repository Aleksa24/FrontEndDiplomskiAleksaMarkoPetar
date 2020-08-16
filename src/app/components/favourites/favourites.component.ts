import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../services/authentication.service";
import {User} from "../../model/User";
import {Post} from "../../model/Post";

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit,OnDestroy {

  subs:Subscription[] = [];
  user: User;
  favourites: Post[] = [];

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalCache();
    this.favourites = this.user.favourites;
    console.log(this.user);
    console.log(this.user.favourites);
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

}
