import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Comment} from "../../model/Comment";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit,OnDestroy {

  subs: Subscription[] = [];
  @Input()comment: Comment;

  constructor() { }

  ngOnInit(): void {
  }

}
