import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Comment} from '../../model/Comment';
import {CommentService} from "../../services/comment.service";
import {User} from "../../model/User";
import {AuthenticationService} from "../../services/authentication.service";
import {Like} from "../../model/Like";
import {MatDialog} from "@angular/material/dialog";

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
    this.commentService.postReplay(this.comment,replayText)
      .then((commentWithNewReply) =>{
        this.comment = commentWithNewReply;
    });
  }

  onDislike(): void {
    let like: Like = this.didUserAlreadyLikedOrDisliked();
    if (this.didUserAlreadyLikedOrDisliked() == null){
      this.commentService.like(this.comment,this.commentService.DISLIKE)
        .then((comment) => {
          this.comment = comment;
          this.isLiked = false;
          this.isLiked = true;
        });
    } else {
      //ovaj if je slucaj kada kliknes na like koji je vec kliknut
      if (like.likeStatus.name == this.commentService.DISLIKE) {
        this.commentService.deleteLike(this.comment,like)
          .then((comment) => {
            this.isDisliked = false;
            this.comment = comment;
          });
      }else
      //update like
      this.commentService.updateLike(this.comment,this.commentService.DISLIKE,like)
        .then((comment) => {
          this.comment = comment;
          this.isLiked = false;
          this.isDisliked = true;
        });
    }
  }

  onLike(): void {
    let like: Like = this.didUserAlreadyLikedOrDisliked();
    if (this.didUserAlreadyLikedOrDisliked() == null){
      this.commentService.like(this.comment,this.commentService.LIKE)
        .then((comment) => {
          this.comment = comment;
          this.isLiked = true;
          this.isDisliked = false;
        });
    } else {
      //ovaj if je slucaj kada kliknes na like koji je vec kliknut
      if (like.likeStatus.name == this.commentService.LIKE) {
        this.commentService.deleteLike(this.comment,like)
          .then((comment) => {
            this.isLiked = false;
            this.comment = comment;
          });
      }else
      //update like
      this.commentService.updateLike(this.comment,this.commentService.LIKE,like)
        .then((comment) => {
          this.comment = comment;
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
}
