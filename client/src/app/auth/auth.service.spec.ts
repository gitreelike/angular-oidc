import {HttpBackend, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
import {OAuthService} from 'angular-oauth2-oidc';
import {Observable, of} from 'rxjs';
import {anything, capture, instance, mock, verify, when} from 'ts-mockito';
import {AuthService, isAngularRouteHash} from './auth.service';
import {Router} from "@angular/router";

class DummyHttpBackend extends HttpBackend {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return of(new HttpResponse({
      body: {
        issuer: 'authServer',
        clientId: 'clientId',
        scopes: 'scopes'
      }
    }));
  }
}

describe('AuthService', () => {
  // There are only tests in the final version.
});
