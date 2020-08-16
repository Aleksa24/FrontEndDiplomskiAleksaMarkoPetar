import { Injectable } from '@angular/core';
import {Channel} from "../model/Channel";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private httpClient: HttpClient) {}

  getChannels(): Observable<Channel[]>{
    return this.httpClient.get<Channel[]>(environment.apiUrl+"/channel/all");
  }

  getById(id: number): Observable<Channel> {
    return this.httpClient.get<Channel>(environment.apiUrl+`/channel/${id}`);
  }
}
