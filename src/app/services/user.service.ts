import {Injectable} from '@angular/core';
import {User} from '../model/User';
import {Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Role} from '../model/Role';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public host = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  addUser(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User | HttpErrorResponse>
    (`${this.host}/user/add`, user);
  }

  updateProfile(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User | HttpErrorResponse>
    (`${this.host}/user/save`, user);
  }

  totalCount(): Observable<number> {
    return this.http.get<number>(`${this.host}/user/total_count`);
  }
}
