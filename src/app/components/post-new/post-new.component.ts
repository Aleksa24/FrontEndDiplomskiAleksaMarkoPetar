import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Post} from "../../model/Post";
import {PostService} from "../../services/post.service";
import {Channel} from "../../model/Channel";
import {ChannelService} from "../../services/channel.service";

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})
export class PostNewComponent implements OnInit,OnDestroy {
  form: FormGroup;

  subs:Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<PostNewComponent>,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title:["",Validators.required],
      body:["",Validators.required],
    });
  }
  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

  closeDialog(){
    this.dialogRef.close();// u ovo moze da se ubaci neka vrednost koja se kasnije vata
  }
}
