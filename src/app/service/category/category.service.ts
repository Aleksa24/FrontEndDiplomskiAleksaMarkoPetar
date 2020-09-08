import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Category} from '../../model/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) {}

  getCategories(): Observable<Category[]>{
    return this.httpClient.get<Category[]>(environment.resourceServerUrl+"/category/all");
  }
}
