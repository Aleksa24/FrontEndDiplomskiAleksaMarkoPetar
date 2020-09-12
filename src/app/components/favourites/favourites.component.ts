import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {User} from "../../model/User";
import {Post} from "../../model/Post";
import {UserService} from "../../service/user/user.service";

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit,OnDestroy {

  subs:Subscription[] = [];
  user: User;
  favourites: Post[] = [];

  constructor(private authService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalCache();
    this.user.favorites.sort((postA, postB) =>postA.dateCreated>postB.dateCreated ? -1:1);
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

  favouriteRemoved(postToRemove: Post) {
    this.subs.push(this.userService.addFavourite(postToRemove,this.userService.REMOVE)
      .subscribe((user) => {
        this.user = user;
        this.authService.saveUserToLocalCache(user);
      }));
  }
}
