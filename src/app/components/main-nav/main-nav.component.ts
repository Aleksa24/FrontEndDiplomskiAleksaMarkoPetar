import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {User} from '../../model/User';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  user: User;

  constructor(private breakpointObserver: BreakpointObserver,
              private authenticationService: AuthenticationService,
              private router: Router) {
  }

  opened: boolean = true;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }
}
