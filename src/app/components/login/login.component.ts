import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {User} from '../../model/User';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {AuthenticationRequest} from '../../model/AuthenticationRequest';
import {UserService} from '../../service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subs: Subscription[];
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.subs = [];
    this.form = this.formBuilder.group({
      username: ['petar', Validators.required],
      password: ['petar', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

  async login(user: User) {
    await this.authenticationService.login(user).then(
      (value: AuthenticationRequest) => {
        this.authenticationService.saveTokenToLocalCache(value.access_token);
      },
      err => {
        console.log(err);
        return;
      });
    await this.userService.findByUsername(user.username).then(
      (value: User) => this.authenticationService.saveUserToLocalCache(value),
      err => console.log(err)
    );
    this.router.navigateByUrl('/home').then();
  }
}
