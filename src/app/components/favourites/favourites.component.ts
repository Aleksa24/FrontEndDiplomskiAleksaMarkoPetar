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
    this.favourites = this.authService.getUserFromLocalCache().favorites;
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

}
