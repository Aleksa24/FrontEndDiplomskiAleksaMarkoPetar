import { Injectable } from '@angular/core';
import {Post} from "../model/Post";
import {Attachment} from "../model/Attachment";
import {Observable} from "rxjs";
import {HttpResponse} from "../model/HttpResponse";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Like} from "../model/Like";
import {User} from "../model/User";
import {Comment} from "../model/Comment";
import {AuthenticationService} from "./authentication.service";
import {LikeStatus} from "../model/LikeStatus";

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  LIKE: string = "Like";
  DISLIKE: string = "Dislike";
  POST: string = "Post";
  COMMENT: string = "Comment";

  constructor(private httpClient: HttpClient,
              private authService:AuthenticationService) { }

  deleteLike(like: Like):Promise<HttpResponse> {
    return this.httpClient.delete<HttpResponse>(`${environment.apiUrl}/like/deleteLike/${like.id}`).toPromise();
  }

  async like(object:string,id:number,likeStatusString:string):Promise<Like>{
    let like: Like = new Like();
    let user: User =this.authService.getUserFromLocalCache();
    like.user = user;
    if (object == null)return null;
    if (object == this.POST){
     let post:Post = new Post();
     post.id = id;
     like.post = post;
    }
    if (object == this.COMMENT){
      let comment:Comment = new Comment();
      comment.id = id;
      like.comment = comment;
    }
    await this.getLikeStatusByName(likeStatusString)
      .then((likeStatus) => {
        like.likeStatus = likeStatus;
      });
    return this.httpClient.post<Like>(environment.apiUrl+"/like/save",like).toPromise();
  }

  getLikeStatusByName(likeStatus: String): Promise<LikeStatus>{
    return this.httpClient.get<LikeStatus>(environment.apiUrl+"/comment/like-status/"+likeStatus).toPromise();
  }

  async updateLike(like:Like,likeStatusString:string) {
    await this.getLikeStatusByName(likeStatusString)
      .then((likeStatus) => {
        like.likeStatus = likeStatus;
      });
    return this.httpClient.post<Like>(environment.apiUrl+"/like/save",like).toPromise();
  }
}
