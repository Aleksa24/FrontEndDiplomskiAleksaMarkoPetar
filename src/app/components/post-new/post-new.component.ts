import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Post} from "../../model/Post";
import {PostService} from "../../services/post.service";
import {Channel} from "../../model/Channel";
import {ChannelService} from "../../services/channel.service";
import {faPaperclip} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})
export class PostNewComponent implements OnInit,OnDestroy {
  form: FormGroup;
  fileForm: FormGroup;
  filesToUpload = [];

  subs:Subscription[] = [];
  faUpload = faPaperclip;

  constructor(public dialogRef: MatDialogRef<PostNewComponent>,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      files: [this.filesToUpload],
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

  detectFilesAndUpdateFormGroup(event) {
    this.filesToUpload = [];
    if (event.target.files.length > 0) {
      for (const file of event.target.files){
        this.filesToUpload.push(file);
      }
      this.form.patchValue({files: this.filesToUpload});
    }
  }

  getSelectedFileNames(): string {
    let result = '';
    this.filesToUpload.forEach(file => result += file.name + ' \n');
    return result;
  }
}
