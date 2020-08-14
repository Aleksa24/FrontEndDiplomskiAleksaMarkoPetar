import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Post} from "../model/Post";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient) { }

  getById(id: number):Observable<Post> {
    return this.httpClient.get<Post>(environment.apiUrl+"/post/"+id);
  }
}
