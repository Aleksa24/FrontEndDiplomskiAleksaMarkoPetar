import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {User} from '../../model/User';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {AuthenticationRequest} from '../../model/AuthenticationRequest';
import {UserService} from '../../service/user/user.service';
import {AuthenticationFailedResponse} from '../../http/response/AuthenticationFailedResponse';
import {error} from '@angular/compiler/src/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public subscriptions: Subscription[];
  public formGroup: FormGroup;
  public authenticationFailedResponseMessage = '';

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.subscriptions = [];
    this.formGroup = this.formBuilder.group({
      username: ['petar', Validators.required],
      password: ['petar', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(value => value.unsubscribe());
  }

  async login(user: User) {
    let isValid = true;
    await this.authenticationService.login(user).then(
      (res: AuthenticationRequest) => {
        this.authenticationService.saveTokenToLocalCache(res.access_token);
      },
      (err: AuthenticationFailedResponse) => {
        this.authenticationFailedResponseMessage = err.error.error_description;
        isValid = false;
      });
    if (!isValid) {
      return;
    }
    await this.userService.findByUsername(user.username).then(
      (res: User) => this.authenticationService.saveUserToLocalCache(res),
      (err: AuthenticationFailedResponse) => {
        console.log(err);
      });
    this.router.navigateByUrl('/home').then();
  }
}
