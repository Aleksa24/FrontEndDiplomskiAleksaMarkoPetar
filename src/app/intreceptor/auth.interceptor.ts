import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<unknown>, handler: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(`${this.authenticationService.host}/user/login`)) {
      return handler.handle(request);
    }
    if (request.url.includes(`${this.authenticationService.host}/user/register`)) {
      return handler.handle(request);
    }
    if (request.url.includes(`${this.authenticationService.host}/user/reset-password`)) {
      return handler.handle(request);
    }
    this.authenticationService.loadTokenFromLocalCache();
    const token = this.authenticationService.getToken();

    const cloneRequest = request.clone({setHeaders: {Authorization: `Bearer ${token}`}})
    return handler.handle(cloneRequest);
  }
}
