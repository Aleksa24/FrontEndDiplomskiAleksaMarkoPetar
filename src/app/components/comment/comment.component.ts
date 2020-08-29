import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Comment} from '../../model/Comment';
import {CommentService} from "../../services/comment.service";
import {User} from "../../model/User";
import {AuthenticationService} from "../../services/authentication.service";
import {Like} from "../../model/Like";
import {MatDialog} from "@angular/material/dialog";
import {LikeService} from "../../services/like.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  @Input() comment: Comment;
  isReplyOpen: boolean = false
  isLiked: boolean = false;
  isDisliked: boolean = false;
  loggedUser: User;

  constructor(private commentService:CommentService,
              private authService: AuthenticationService,
              private likeService: LikeService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loggedUser = this.authService.getUserFromLocalCache();

    this.subs.push(this.commentService.getCommentById(this.comment.id)
      .subscribe((comment) => {
        this.comment = comment;

        //prolazi da vidi da li je taj comment lajkovan kod ulogovanog usera da bi obelezio slova
        for (let like of this.comment.likes){
          if (like.user.id == this.loggedUser.id){
            if (like.likeStatus.name == this.commentService.LIKE){
              this.isLiked = true;
              this.isDisliked = false;
              break;
            }
            if (like.likeStatus.name == this.commentService.DISLIKE){
              this.isLiked = false;
              this.isDisliked = true;
              break;
            }
          }
        }
      }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

  replyButtonClicked() {
    this.isReplyOpen = !this.isReplyOpen;
  }

  postReply(replayText: string) {
    if (replayText == null || replayText.length==0){
      return
    }
    this.commentService.postReplay(this.comment,replayText)
      .then((commentWithNewReply) =>{
        this.comment = commentWithNewReply;
    });
  }

  onDislike(): void {
    let like: Like = this.didUserAlreadyLikedOrDisliked();
    if (this.didUserAlreadyLikedOrDisliked() == null){
      this.likeService.like(this.likeService.COMMENT,this.comment.id,this.likeService.DISLIKE)
        .then((value) => {
          // this.comment = comment;
          this.comment.likes.push(value);
          this.isLiked = false;
          this.isDisliked = true;
        });
    } else {
      //ovaj if je slucaj kada kliknes na like koji je vec kliknut
      if (like.likeStatus.name == this.commentService.DISLIKE) {
        this.likeService.deleteLike(like)
          .then((httpResponse) => {
            this.isDisliked = false;
            this.comment.likes = this.comment.likes.filter(value => value.id != like.id);
          });
      }else
      //update like
      this.likeService.updateLike(like,this.likeService.DISLIKE)
        .then((value) => {
          this.comment.likes = this.comment.likes.filter(_like => _like.id != like.id);
          this.comment.likes.push(value);
          this.isLiked = false;
          this.isDisliked = true;
        });
    }
  }

  onLike(): void {
    let like: Like = this.didUserAlreadyLikedOrDisliked();
    if (this.didUserAlreadyLikedOrDisliked() == null){
      this.likeService.like(this.likeService.COMMENT,this.comment.id,this.likeService.LIKE)
        .then((value) => {
          // this.comment = comment;
          this.comment.likes.push(value);
          this.isLiked = true;
          this.isDisliked = false;
        });
    } else {
      //ovaj if je slucaj kada kliknes na like koji je vec kliknut
      if (like.likeStatus.name == this.commentService.LIKE) {
        this.likeService.deleteLike(like)
          .then((httpResponse) => {
            this.isLiked = false;
            this.comment.likes = this.comment.likes.filter(value => value.id != like.id);
          });
      }else
      //update like
      this.likeService.updateLike(like,this.likeService.LIKE)
        .then((value) => {
          this.comment.likes = this.comment.likes.filter(_like => _like.id != like.id);
          this.comment.likes.push(value);
          this.isLiked = true;
          this.isDisliked = false;
        });
    }

  }

  /**
   * like objekat: ako postoji lajk sa tim user-om
   * null: ako ne postoji lajk sa tim user-om
   */
  private didUserAlreadyLikedOrDisliked():Like {
    for (let like of this.comment.likes){
      if (like.user.id == this.loggedUser.id){
        return like;
      }
    }
    return null;
  }

  edit() {
    //todo:odraditi edit comment-a
  }
  getLikesNumber() {
    return this.comment.likes.filter(value => value.likeStatus.name == this.likeService.LIKE).length;
  }
  getDislikeNumber() {
    return this.comment.likes.filter(value => value.likeStatus.name == this.likeService.DISLIKE).length;
  }
}
