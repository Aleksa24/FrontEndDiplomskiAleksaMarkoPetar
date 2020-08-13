import { Injectable } from '@angular/core';
import {Channel} from "../model/Channel";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  channels: Channel[] = [
    {id:1,name:"Name1"},
    {id:2,name:"Name2"},

  ];

  constructor(private httpClient: HttpClient) {

  }

  getChannels(){
    return this.channels;
  }

  getById(id: number): Observable<Channel> {
    return of(this.channels.find(value => value.id == id));
  }
}
