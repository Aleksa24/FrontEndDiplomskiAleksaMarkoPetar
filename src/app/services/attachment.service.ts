import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Attachment} from '../model/Attachment';
import {environment} from '../../environments/environment';
import {AttachmentUploadData} from '../model/AttachmentUploadData';
import {Post} from '../model/Post';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(private httpClient: HttpClient) { }

  add(formData: FormData): Observable<HttpEvent<Attachment>> {
    return this.httpClient.post<Attachment>(`${environment.apiUrl}/attachment/add`, formData, {
      observe: 'events',
      reportProgress: true
    });
  }

  downloadFile(post: Post, attachment: Attachment): Observable<Blob> {
    return this.httpClient.get(`${environment.apiUrl}/attachment/post/${post.id}/file/${attachment.originalName}`, {
      responseType: 'blob'
    });
  }
}
