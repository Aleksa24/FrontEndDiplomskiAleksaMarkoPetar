import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Comment} from '../../model/Comment';
import {PostService} from "../../services/post.service";
import {CommentService} from "../../services/comment.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  @Input() comment: Comment;
  isReplyOpen: boolean = false

  constructor(private commentService:CommentService) {
  }

  ngOnInit(): void {
    this.subs.push(this.commentService.getCommentById(this.comment.id)
      .subscribe((comment) => {
        this.comment = comment;
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
}
