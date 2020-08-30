import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Attachment} from '../model/Attachment';
import {environment} from '../../environments/environment';
import {AttachmentUploadData} from '../model/AttachmentUploadData';
import {Post} from '../model/Post';
import {HttpResponse} from '../model/HttpResponse';

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

  downloadFile(parentId: number, parentName: string, attachment: Attachment): Observable<Blob> {
    return this.httpClient.get(`${environment.apiUrl}/attachment/${parentName}/${parentId}/file/${attachment.originalName}`, {
      responseType: 'blob'
    });
  }

  delete(parentId: number, parentName: string, attachment: Attachment): Observable<HttpResponse> {
    return this.httpClient.delete<HttpResponse>(`${environment.apiUrl}/attachment/${parentName}/${parentId}/${attachment.id}/delete`);
  }
}
