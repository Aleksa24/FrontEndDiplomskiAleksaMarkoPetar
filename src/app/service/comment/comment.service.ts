import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {CommentStatus} from "../../model/CommentStatus";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Comment} from "../../model/Comment";
import {AuthenticationService} from "../authentication/authentication.service";
import {Post} from "../../model/Post";
import {Like} from "../../model/Like";
import {User} from "../../model/User";
import {LikeStatus} from "../../model/LikeStatus";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  ORIGINAL: string = "Original";
  LIKE: string = "Like";
  DISLIKE: string = "Dislike";

  constructor(private httpClient: HttpClient,
              private authService: AuthenticationService) { }

   getCommentStatusByName(statusName: string): Promise<CommentStatus> {
    return this.httpClient.get<CommentStatus>(environment.resourceServerUrl + "/comment/comment-status/" + statusName).toPromise();
  }
  getCommentById(id: number):Observable<Comment> {
    return this.httpClient.get<Comment>(environment.resourceServerUrl+"/comment/"+id);
  }

  async postReplay(comment: Comment, replayText: string): Promise<Comment> {
    let replay:Comment = new Comment();
    replay.text = replayText;
    replay.user = this.authService.getUserFromLocalCache();

    await this.getCommentStatusByName(this.ORIGINAL).then((commentStatus) => {
      replay.commentStatus = commentStatus;
    });
    comment.comments.push(replay);
    return this.httpClient.post<Comment>(environment.resourceServerUrl+"/comment/addReplay",comment).toPromise();
  }


  // =============

  async like(comment: Comment,likeStatusString: string): Promise<Comment> {
    let like: Like = new Like();
    let user: User =this.authService.getUserFromLocalCache();
    // user.favorites = null;//namestam da je null da ne bi ulazilo u beskonacnu petlju negde
    like.user = user;
    await this.getLikeStatusByName(likeStatusString)
      .then((likeStatus) => {
        like.likeStatus = likeStatus;
      });
    comment.likes.push(like);
    return this.httpClient.post<Comment>(environment.resourceServerUrl+"/comment/addLike",comment).toPromise();
  }

  async updateLike(comment: Comment, likeStatusString: string, like: Like):Promise<Comment> {
    let user: User =this.authService.getUserFromLocalCache();
    // user.favorites = null;//namestam da je null da ne bi ulazilo u beskonacnu petlju negde
    await this.getLikeStatusByName(likeStatusString)
      .then((likeStatus) => {
        like.likeStatus = likeStatus;
      });
    return this.httpClient.post<Comment>(environment.resourceServerUrl+"/comment/addLike",comment).toPromise();
  }

  deleteLike(comment: Comment, like: Like):Promise<Comment> {
    comment.likes = comment.likes.filter(value => value.id != like.id)
    return this.httpClient.post<Comment>(`${environment.resourceServerUrl}/comment/save`,comment).toPromise();
  }

  getLikeStatusByName(likeStatus: String): Promise<LikeStatus>{
    return this.httpClient.get<LikeStatus>(environment.resourceServerUrl+"/comment/like-status/"+likeStatus).toPromise();
  }

  save(comment: Comment): Observable<Comment> {
    return this.httpClient.post<Comment>(`${environment.resourceServerUrl}/comment/save`, comment);
  }
}
