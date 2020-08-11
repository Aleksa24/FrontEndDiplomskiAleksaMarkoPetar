import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public host = environment.apiUrl;
  private token: string;
  private loggedUsername: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
  }

  login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>
    (`${this.host}/auth/login`, user, {observe: 'response'}); // full response
  }

  register(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User | HttpErrorResponse>
    (`${this.host}/user/register`, user); // body
  }

  logout(): void {
    this.token = null;
    this.loggedUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  saveTokenToLocalCache(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  saveUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  loadTokenFromLocalCache(): void {
    this.token = localStorage.getItem('token');
  }

  getToken(): string {
    return this.token;
  }

  isLogged(): boolean {
    this.loadTokenFromLocalCache();

    if ((this.token == null || this.token === '') ||
      (this.jwtHelper.decodeToken(this.token).sub == null || '') ||
      (this.jwtHelper.isTokenExpired(this.token))) {
      this.logout();
      return false;
    } else {
      this.loggedUsername = this.jwtHelper.decodeToken(this.token).sub;
      return true;
    }
  }

}
