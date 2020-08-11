import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {User} from "../../model/User";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  private subs: Subscription[];
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.subs = [];
    this.form = this.formBuilder.group({
      username: ['petar',Validators.required],
      password: ['petar',Validators.required]
    });
  }

  login(user: User) {
    this.subs.push(this.authenticationService.login(user).subscribe(
      (response: HttpResponse<User>) => {
        const token = response.headers.get("Jwt-Token");
        console.log("token:   " + token);
        this.authenticationService.saveTokenToLocalCache(token);
        this.authenticationService.saveUserToLocalCache(response.body);
        this.router.navigateByUrl("/home");
      },
      (errorResponse:HttpErrorResponse) => {
        console.dir(errorResponse);
      }
    ));
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }
}
