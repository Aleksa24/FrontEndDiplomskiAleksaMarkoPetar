import {Component, OnDestroy, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {map, shareReplay, startWith} from 'rxjs/operators';
import {User} from '../../model/User';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {Router} from '@angular/router';
import {FormControl} from "@angular/forms";
import {Searchable} from "../../model/Searchable";
import {SearchableService} from "../../services/searchable.service";
import {serialize} from "v8";
import {Post} from "../../model/Post";
import {hasOwnProperty} from "tslint/lib/utils";
import {Channel} from "../../model/Channel";
import {ChannelService} from "../../service/channel/channel.service";
import {PostService} from "../../service/post/post.service";


export interface State {
  flag: string;
  name: string;
  population: string;
}
@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit,OnDestroy {

  user: User;

  searchableCtrl = new FormControl();
  filteredSearchable$: Observable<Searchable[]>;
  searchables: Searchable[] = [];
  subs:Subscription[] = [];

  opened: boolean = true;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private authenticationService: AuthenticationService,
              private router: Router,
              private searchableService: SearchableService,
              private channelService: ChannelService,
              private postService: PostService) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }

  letterEntered(filterValue:string):void {
    if (filterValue.length===0){
      this.searchables = [];
      return;}
    this.subs.push(
      this.searchableService.getChannelsAndPosts(filterValue)
        .subscribe((searchableList) => {
            this.searchables = searchableList.map(value => {
              if ("name" in value) return  Object.assign(new Channel(),value);
              if ("title" in value) return Object.assign(new Post(),value);
            })
          },
          error => console.dir(error))
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

  search(searchable: Searchable) {
    if ("name" in searchable) {
      // @ts-ignore
      this.router.navigate([`/channel/${searchable.getId()}`]).then();
      this.searchables = [];
      // @ts-ignore
      let autocompleteField = document.getElementById("autocompleteField").value = "";
    }
    if ("title" in searchable) {
      // @ts-ignore
      this.channelService.getChannelIdByPostId(searchable.getId())
        .then((id) => {
          // @ts-ignore
          this.postService.savePostIdForNavigation(searchable.getId());
          // @ts-ignore
          this.router.navigate([`/channel/${id}`]).then();
          this.searchables = [];
          // @ts-ignore
          document.getElementById("autocompleteField").value = "";
        });
    }
  }

  isAddUserAllowed():boolean {
    if (this.user.role.userPermissions.map(value => value.name).includes("user:write")) return true;
    return false;
  }

  isMakeChannelAllowed() {
    if (this.user.role.userPermissions.map(value => value.name).includes("channel:write")) return true;
    return false;
  }
}
