import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../../service/authentication/authentication.service";
import {ChannelService} from "../../service/channel/channel.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthenticationService,
              private router: Router,
              private channelService: ChannelService) {
  }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    // :Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if (next.url.map(value => value.path).includes("add-user") && this.authService.getUserFromLocalCache().role.userPermissions.map(value => value.name).includes("user:write")) return true;

    if ((next.url.map(value => value.path).includes("make-channel") || next.url.map(value => value.path).includes("edit-channel"))
      && this.authService.getUserFromLocalCache().role.userPermissions.map(value => value.name).includes("channel:write")) return true;

    if (next.url.map(value => value.path).includes("channel")) {
      let boolean = false;
       await this.channelService.isUserInChannel(Number(next.url[1].path))
         .then(value =>{
         if (value === false) {
           this.router.navigate(["/home"]).then();
           return false;
         }
         if (value === true) boolean = value;
       });
       return boolean;
    }
    this.router.navigate(["/home"]).then();
    return false;
  }

}
