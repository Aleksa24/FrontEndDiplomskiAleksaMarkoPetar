import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Attachment} from "../../model/Attachment";
import {faArchive, faCoffee, faDownload, faFilePdf, faImage, faStarOfDavid, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Post} from '../../model/Post';
import {PostService} from '../../services/post.service';
import {User} from '../../model/User';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {

  @Input() attachment: Attachment;
  @Input() post: Post;
  @Input() uploadProgress: number;
  @Output() deleteAttachment: EventEmitter<Attachment> = new EventEmitter<Attachment>();
  public loggedInUser: User;
  public faDownload = faDownload;
  faDocument = faFilePdf;
  faDelete = faTimes;

  constructor(private postService: PostService, private authService: AuthenticationService) { }

  ngOnInit(): void {
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
    this.postService.downloadAttachment(this.post, this.attachment).subscribe(
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
    this.postService.removeAttachment(this.post, this.attachment).subscribe(
      (data) => {
        this.deleteAttachment.emit(this.attachment);
      }
    );
  }

  onAbortUpload(): void {
    this.attachment.uploadAborted = true;
  }
}
