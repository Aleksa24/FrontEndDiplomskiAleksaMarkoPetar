import { Injectable } from '@angular/core';
import {Channel} from "../model/Channel";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Post} from "../model/Post";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private httpClient: HttpClient,
              private authService: AuthenticationService) {}

  getChannels(): Observable<Channel[]>{
    return this.httpClient.get<Channel[]>(environment.apiUrl+"/channel/all");
    // return of(this.channels);
  }

  getById(id: number): Observable<Channel> {
    return this.httpClient.get<Channel>(environment.apiUrl+`/channel/${id}`);
  }

}
