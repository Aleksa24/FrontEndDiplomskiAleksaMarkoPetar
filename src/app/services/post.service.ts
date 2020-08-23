import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Post} from "../model/Post";
import {Comment} from "../model/Comment";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthenticationService} from "./authentication.service";
import {CommentStatus} from "../model/CommentStatus";
import {CommentService} from "./comment.service";
import {timeout} from "rxjs/operators";
import {Channel} from "../model/Channel";
import {Like} from "../model/Like";
import {LikeStatus} from "../model/LikeStatus";
import {User} from "../model/User";
import {brotliCompress} from "zlib";
import {Attachment} from "../model/Attachment";
import {HttpResponse} from '../model/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  LIKE: string = "Like";
  DISLIKE: string = "Dislike";

  constructor(private httpClient: HttpClient,
              private authService: AuthenticationService,
              private commentService: CommentService) { }

  getById(id: number):Observable<Post> {
    return this.httpClient.get<Post>(environment.apiUrl+"/post/"+id);
  }

  async postComment(post:Post,commentText:string):Promise<Post> {
    let comment: Comment = new Comment();
    comment.text = commentText;
    comment.user = this.authService.getUserFromLocalCache();
    await this.commentService.getCommentStatusByName(this.commentService.ORIGINAL)
      .then((recevedStatus) =>{
        comment.commentStatus = recevedStatus;
    });
    post.comments.push(comment);

    return this.httpClient.post<Post>(environment.apiUrl+"/post/addComment",post).toPromise();
  }

  savePost(channel: Channel, post: Post): Observable<Post> {
    post.channel = channel;
    post.user = this.authService.getUserFromLocalCache();
    return this.httpClient.post<Post>(environment.apiUrl+"/post/save",post);
  }

  async like(post: Post,likeStatusString: string): Promise<Post> {
    let like: Like = new Like();
    let user: User =this.authService.getUserFromLocalCache();
    // user.favorites = null;//namestam da je null da ne bi ulazilo u beskonacnu petlju negde
    like.user = user;
    await this.getLikeStatusByName(likeStatusString)
      .then((likeStatus) => {
        like.likeStatus = likeStatus;
      });
    post.likes.push(like);
    return this.httpClient.post<Post>(environment.apiUrl+"/post/addLike",post).toPromise();
  }

  async updateLike(post: Post, likeStatusString: string, like: Like):Promise<Post> {
    let user: User =this.authService.getUserFromLocalCache();
    // user.favorites = null;//namestam da je null da ne bi ulazilo u beskonacnu petlju negde
    await this.getLikeStatusByName(likeStatusString)
      .then((likeStatus) => {
        like.likeStatus = likeStatus;
      });
    return this.httpClient.post<Post>(environment.apiUrl+"/post/addLike",post).toPromise();
  }

  getLikeStatusByName(likeStatus: String): Promise<LikeStatus>{
    return this.httpClient.get<LikeStatus>(environment.apiUrl+"/comment/like-status/"+likeStatus).toPromise();
  }

  addAttachment(formData:FormData):Observable<Attachment> {
    return this.httpClient.post<Attachment>(`${environment.apiUrl}/post/addAttachment`,formData);
  }

  downloadAttachment(post: Post, attachment: Attachment): Observable<Blob>{
    return this.httpClient.get(`${environment.apiUrl}/post/${post.id}/file/${attachment.originalName}`, {
      responseType: 'blob'
    });
  }

  removeAttachment(post: Post, attachment: Attachment): Observable<HttpResponse> {
    return this.httpClient.delete<HttpResponse>(`${environment.apiUrl}/post/${post.id}/attachment/${attachment.id}/delete`);
  }
}
