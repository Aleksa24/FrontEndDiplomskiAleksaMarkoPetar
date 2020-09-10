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
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, handler: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(`${environment.authorizationServerUrl}/oauth/token`)) {
      return handler.handle(request);
    }

    if (!this.authenticationService.isLogged()) {
      this.router.navigate(['/login']).then();
    }

    this.authenticationService.loadTokenFromLocalCache();
    const token = this.authenticationService.getToken();

    const cloneRequest = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    return handler.handle(cloneRequest);
  }
}
