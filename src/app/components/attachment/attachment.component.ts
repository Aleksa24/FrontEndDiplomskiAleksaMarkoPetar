import {Component, Input, OnInit} from '@angular/core';
import {Attachment} from "../../model/Attachment";
import {faCoffee, faDownload, faFilePdf, faImage, faStarOfDavid} from '@fortawesome/free-solid-svg-icons';
import {Post} from '../../model/Post';
import {PostService} from '../../services/post.service';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {

  @Input() attachment: Attachment;
  @Input() post: Post;
  public faDownload = faDownload;
  faDocument = faFilePdf;
  downloadUrl: string;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.resolveFileIconBytype();
    this.downloadUrl = this.postService.makeDownloadUrl(this.post, this.attachment);
  }

  resolveFileIconBytype(): any {
    switch (this.attachment.originalName.substr(this.attachment.originalName.lastIndexOf('.') + 1)){
      case 'png':
        this.faDocument = faImage;
        break;
      case 'pdf':
        this.faDocument =  faFilePdf;
        break;
      default:
        this.faDocument = faStarOfDavid;
    }
  }
}
