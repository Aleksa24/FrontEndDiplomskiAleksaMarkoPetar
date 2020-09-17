import { Injectable } from '@angular/core';
import {PostService} from "../service/post/post.service";
import {ChannelService} from "../service/channel/channel.service";
import {Observable, of} from "rxjs";
import {Searchable} from "../model/Searchable";
import {Post} from "../model/Post";
import {Channel} from "../model/Channel";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthenticationService} from "../service/authentication/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class SearchableService {

  constructor(private httpClient: HttpClient,
              private authService: AuthenticationService) { }

  getChannelsAndPosts(filterValue: string): Observable<Searchable[]>{
    let userId = this.authService.getUserFromLocalCache().id;
    return this.httpClient.get<Searchable[]>(`${environment.resourceServerUrl}/searchable/channels-and-posts?filterValue=${filterValue}&userId=${userId}`);
  }
}
