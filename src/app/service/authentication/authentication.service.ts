import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../../model/User';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthenticationRequest} from '../../model/AuthenticationRequest';
import {Observable} from 'rxjs';
import {AccountVerificationRequest} from '../../model/AccountVerificationRequest';
import has = Reflect.has;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token: string;
  private loggedUsername: string;
  private jwtHelper = new JwtHelperService();

  constructor(private httpClient: HttpClient) {
  }

  login(user): Promise<AuthenticationRequest> {
    let params = new URLSearchParams();
    params.append('username', user.username);
    params.append('password', user.password);
    params.append('grant_type', 'password');
    params.append('scope', 'read');

    let headers =
      new HttpHeaders({
        'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Authorization': 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)
      });

    return this.httpClient.post<AuthenticationRequest>(`${environment.authorizationServerUrl}/oauth/token`,
      params.toString(), {headers: headers}).toPromise();
  }

  logout(): void {
    this.token = null;
    this.loggedUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
      (this.jwtHelper.decodeToken(this.token).user_name == null || '') ||
      (this.jwtHelper.isTokenExpired(this.token))) {
      this.logout();
      return false;
    } else {
      this.loggedUsername = this.jwtHelper.decodeToken(this.token).sub;
      return true;
    }
  }

  verifyActivationToken(hash: string, id: number): Observable<User> {
    const accountVerificationRequest: AccountVerificationRequest = new AccountVerificationRequest();
    accountVerificationRequest.userId = id;
    accountVerificationRequest.token = hash;
    return this.httpClient.post<User>(`${environment.resourceServerUrl}/user/verify-activation-token`, accountVerificationRequest);
  }
}
