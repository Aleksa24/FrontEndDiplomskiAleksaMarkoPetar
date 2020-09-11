import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Attachment} from "../../model/Attachment";
import {
  faArchive,
  faCoffee,
  faDownload,
  faFilePdf,
  faImage,
  faStarOfDavid,
  faTimes,
  faTrash,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import {Post} from '../../model/Post';
import {PostService} from '../../service/post/post.service';
import {User} from '../../model/User';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {AttachmentService} from '../../service/attachment/attachment.service';
import {Comment} from '../../model/Comment';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {

  @Input() attachment: Attachment;
  @Input() post: Post;
  @Input() comment: Comment;
  @Input() uploadProgress: number;
  @Output() deleteAttachment: EventEmitter<Attachment> = new EventEmitter<Attachment>();
  public loggedInUser: User;
  public faDownload = faDownload;
  faDocument = faFilePdf;
  faDelete = faTrashAlt;
  public parentId: number;
  public parentName: string;

  constructor(private postService: PostService,
              private authService: AuthenticationService,
              private attachmentService: AttachmentService) { }

  ngOnInit(): void {
    this.resolveParent();
    this.resolveFileIconByType();
    this.loggedInUser = this.authService.getUserFromLocalCache();
  }

  resolveFileIconByType(): any {
    switch (this.attachment.originalName.substr(this.attachment.originalName.lastIndexOf('.') + 1)){
      case 'png':
        this.faDocument = faImage;
        break;
      case 'pdf':
        this.faDocument =  faFilePdf;
        break;
      case 'rar':
      case 'zip':
        this.faDocument = faArchive;
        break;
      default:
        this.faDocument = faStarOfDavid;
    }
  }

  onDownloadClick(): void {
    this.attachmentService.downloadFile(this.parentId, this.parentName, this.attachment).subscribe(
      (data) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(data);
        a.href = objectUrl;
        a.download = this.attachment.originalName;
        a.click();
        URL.revokeObjectURL(objectUrl);
      }
    );
  }

  onDeleteClick(): void {
    this.attachmentService.delete(this.parentId, this.parentName, this.attachment).subscribe(
      (data) => {
        this.deleteAttachment.emit(this.attachment);
      }
    );
  }
  resolveParent(): void{
    if (this.post !== undefined){
      this.parentName = 'post';
      this.parentId = this.post.id;
    }
    if (this.comment !== undefined){
      this.parentName = 'comment';
      this.parentId = this.comment.id;
    }
  }

  onAbortUpload(): void {
    this.attachment.uploadAborted = true;
  }
}
