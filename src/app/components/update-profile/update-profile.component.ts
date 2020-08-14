import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user.service';
import {User} from '../../model/User';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  private subs: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: [this.authenticationService.getUserFromLocalCache().firstName, [Validators.required]],
      lastName: [this.authenticationService.getUserFromLocalCache().lastName, [Validators.required]],
      username: [this.authenticationService.getUserFromLocalCache().username, [Validators.required]],
      phone: [this.authenticationService.getUserFromLocalCache().phone]
    });
  }

  updateUser() {
    let user: User = this.authenticationService.getUserFromLocalCache();
    user.firstName = this.form.get('firstName').value;
    user.lastName = this.form.get('lastName').value;
    user.username = this.form.get('username').value;
    user.phone = this.form.get('phone').value;
    console.log(user);
    this.subs.push(this.userService.updateProfile(user).subscribe(
      (response: User) => {
        this.authenticationService.saveUserToLocalCache(user);
      },
      (errorResponse: HttpErrorResponse) => {
        console.dir(errorResponse);
      }
    ));
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }
}
