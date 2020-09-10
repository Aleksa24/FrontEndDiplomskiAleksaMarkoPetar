import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription, throwError} from 'rxjs';
import {Comment} from '../../model/Comment';
import {CommentService} from '../../service/comment/comment.service';
import {User} from '../../model/User';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {Like} from '../../model/Like';
import {MatDialog} from '@angular/material/dialog';
import {LikeService} from '../../service/like/like.service';
import {faPaperclip} from '@fortawesome/free-solid-svg-icons';
import {Attachment} from '../../model/Attachment';
import {catchError, map} from 'rxjs/operators';
import {HttpEventType} from '@angular/common/http';
import {AttachmentService} from '../../service/attachment/attachment.service';
import {UserService} from '../../service/user/user.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];
  @Input() comment: Comment;
  isReplyOpen = false;
  isLiked = false;
  isDisliked = false;
  loggedUser: User;
  faUpload = faPaperclip;
  filesToUpload = [];
  editEnabled = false;
  filesToUploadReply = [];


  constructor(private commentService: CommentService,
              private authService: AuthenticationService,
              private likeService: LikeService,
              private matDialog: MatDialog,
              private attachmentService: AttachmentService,
              private userService: UserService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.loggedUser = this.authService.getUserFromLocalCache();


    if (this.comment.filesToUpload !== undefined  && this.comment.filesToUpload.length > 0){
      this.filesToUpload = this.comment.filesToUpload;
    }


    this.subs.push(this.commentService.getCommentById(this.comment.id)
      .subscribe((comment) => {
        this.comment = comment;



        this.onUpload();
        this.getProfilePictureByUserId(this.comment.user.id);
        this.filesToUpload = [];
        // (TODO: (this should be in onUpload method)) if user opens comments multiple times this shouldn't trigger upload more than once


        // prolazi da vidi da li je taj comment lajkovan kod ulogovanog usera da bi obelezio slova
        for (const like of this.comment.likes){
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

  async postReply(replayText: string): Promise<void> {
    if (replayText == null || replayText.length == 0){
      return;
    }

    const replay: Comment = new Comment();
    replay.text = replayText;
    replay.user = this.authService.getUserFromLocalCache();

    replay.comment = this.comment;

    await this.commentService.getCommentStatusByName(this.commentService.ORIGINAL)
      .then((recevedStatus) => {
        replay.commentStatus = recevedStatus;
      });
    this.subs.push(this.commentService.save(replay).subscribe(
      (data) => {
        const savedComment = data;
        savedComment.filesToUpload = this.filesToUploadReply;
        this.comment.comments.push(data);
        this.isReplyOpen = true; // to ensure that files will be uploaded
      }
    ));
    // this.commentService.postReplay(this.comment, replayText)
    //   .then((commentWithNewReply) => {
    //     this.comment = commentWithNewReply;
    // });
  }

  onDislike(): void {
    const like: Like = this.didUserAlreadyLikedOrDisliked();
    if (this.didUserAlreadyLikedOrDisliked() == null){
      this.likeService.like(this.likeService.COMMENT, this.comment.id, this.likeService.DISLIKE)
        .then((value) => {
          // this.comment = comment;
          this.comment.likes.push(value);
          this.isLiked = false;
          this.isDisliked = true;
        });
    } else {
      // ovaj if je slucaj kada kliknes na like koji je vec kliknut
      if (like.likeStatus.name == this.commentService.DISLIKE) {
        this.likeService.deleteLike(like)
          .then((httpResponse) => {
            this.isDisliked = false;
            this.comment.likes = this.comment.likes.filter(value => value.id != like.id);
          });
      }else {
      // update like
      this.likeService.updateLike(like, this.likeService.DISLIKE)
        .then((value) => {
          this.comment.likes = this.comment.likes.filter(_like => _like.id != like.id);
          this.comment.likes.push(value);
          this.isLiked = false;
          this.isDisliked = true;
        });
      }
    }
  }

  onLike(): void {
    const like: Like = this.didUserAlreadyLikedOrDisliked();
    if (this.didUserAlreadyLikedOrDisliked() == null){
      this.likeService.like(this.likeService.COMMENT, this.comment.id, this.likeService.LIKE)
        .then((value) => {
          // this.comment = comment;
          this.comment.likes.push(value);
          this.isLiked = true;
          this.isDisliked = false;
        });
    } else {
      // ovaj if je slucaj kada kliknes na like koji je vec kliknut
      if (like.likeStatus.name == this.commentService.LIKE) {
        this.likeService.deleteLike(like)
          .then((httpResponse) => {
            this.isLiked = false;
            this.comment.likes = this.comment.likes.filter(value => value.id != like.id);
          });
      }else {
      // update like
      this.likeService.updateLike(like, this.likeService.LIKE)
        .then((value) => {
          this.comment.likes = this.comment.likes.filter(_like => _like.id != like.id);
          this.comment.likes.push(value);
          this.isLiked = true;
          this.isDisliked = false;
        });
      }
    }

  }

  /**
   * like objekat: ako postoji lajk sa tim user-om
   * null: ako ne postoji lajk sa tim user-om
   */
  private didUserAlreadyLikedOrDisliked(): Like {
    for (const like of this.comment.likes){
      if (like.user.id == this.loggedUser.id){
        return like;
      }
    }
    return null;
  }

  edit() {
    this.editEnabled = !this.editEnabled;
  }
  onSaveComment(): void {
    this.editEnabled = false;
    this.subs.push(
      this.commentService.save(this.comment).subscribe(
        (data) => {
          this.comment = data;
        }
      )
    );
  }

  getLikesNumber() {
    return this.comment.likes.filter(value => value.likeStatus.name == this.likeService.LIKE).length;
  }
  getDislikeNumber() {
    return this.comment.likes.filter(value => value.likeStatus.name == this.likeService.DISLIKE).length;
  }

  detectFiles(event): void {
    this.filesToUpload = [];
    if (event.target.files.length > 0) {
      for (const file of event.target.files){
        this.filesToUpload.push(file);
      }
    }
  }

  getSelectedFileNames(filesToUploadReply: any[]): string {
    let result = '';
    filesToUploadReply.forEach(file => result += file.name + ' \n');
    if (result === ''){
      return 'Select files to upload as an attachment';
    }
    return result;
  }

  onUpload(): void {
    if (this.filesToUpload.length > 0){
      this.filesToUpload.forEach(file => this.uploadFile(file));
    }
  }

  uploadFile(file): void {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', String(this.loggedUser.id));
    formData.append('attachmentParentId', String(this.comment.id));
    formData.append('attachmentParentName', 'COMMENT');

    const dummyAttachment: Attachment = new Attachment();
    dummyAttachment.uploadComplete = false;
    dummyAttachment.originalName = file.name;
    dummyAttachment.uploadProgress = 0;
    this.comment.attachments.push(dummyAttachment);
    this.attachmentService.add(formData).pipe(
      map((event: any) => {
        if (dummyAttachment.uploadAborted){
          throw new Error('UPLOAD_ABORTED');
        }
        if (event.type === HttpEventType.UploadProgress) {
          dummyAttachment.uploadProgress = Math.round((100 / event.total) * event.loaded);
        } else if (event.type === HttpEventType.Response) {
          this.comment.attachments = this.comment.attachments.filter(att => att.originalName !== file.name);
          const uploadedAttachment: Attachment = event.body;
          uploadedAttachment.uploadComplete = true;
          this.comment.attachments.push(uploadedAttachment);
        }
      }),
      catchError((err: any) => {
        let dummyAttachmentRemoveName: string;
        if (dummyAttachment.uploadAborted){
          dummyAttachmentRemoveName = err.message;
        }else{
          dummyAttachmentRemoveName = err.error;
          dummyAttachment.uploadProgress = 0;
          dummyAttachment.uploadError = true;
        }
        dummyAttachment.originalName = dummyAttachmentRemoveName;
        setTimeout(() => {
          this.comment.attachments = this.comment.attachments.filter(att => att.originalName !== dummyAttachmentRemoveName);
        }, 3000);
        return throwError(err.message);
      })
    ).toPromise().then(
      (value => {
        console.log(value);
      }),
      (error => {
        console.log(error);
      })
    );
  }

  onDeleteAttachment(attachment: Attachment): void {
    this.comment.attachments = this.comment.attachments.filter(value => value.id !== attachment.id);
    console.log(this.comment.attachments);
  }

  detectFilesReply(event): void {
    this.filesToUploadReply = [];
    if (event.target.files.length > 0) {
      for (const file of event.target.files){
        this.filesToUploadReply.push(file);
      }
    }
  }

  getProfilePictureByUserId(id: number) {
    return this.userService.getProfilePictureById(id).subscribe(
      data => {
        const objectURL = URL.createObjectURL(data);
        const img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.comment.user.profilePicture = img;
      }
    );
  }


  onUploadFiles($event: Event): void {
    this.detectFiles($event);
    this.onUpload();
  }
}
