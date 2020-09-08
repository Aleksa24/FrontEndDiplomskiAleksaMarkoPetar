import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../service/authentication/authentication.service';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<unknown>, handler: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(`${environment.authorizationServerUrl}/oauth/token`)) {
      return handler.handle(request);
    }
    this.authenticationService.loadTokenFromLocalCache();
    const token = this.authenticationService.getToken();

    const cloneRequest = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    return handler.handle(cloneRequest);
  }
}
