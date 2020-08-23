import {Component, Input, OnInit} from '@angular/core';
import {Attachment} from "../../model/Attachment";
import { faCoffee,faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {

  @Input() attachment: Attachment;
  public faDownload = faDownload;

  constructor() { }

  ngOnInit(): void {
  }

}
