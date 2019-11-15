import {HttpBackend, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
import {OAuthService} from 'angular-oauth2-oidc';
import {Observable, of} from 'rxjs';
import {anything, capture, instance, mock, verify, when} from 'ts-mockito';
import {AuthService, isAngularRouteHash} from './auth.service';
import {Router} from "@angular/router";
import {async} from "@angular/core/testing";

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
  const oauthService: OAuthService = mock(OAuthService);
  const router: Router = mock(Router);
  const httpBackend: HttpBackend = new DummyHttpBackend();
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService(instance(oauthService), instance(router), httpBackend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should know route #/ to be an angular route hash', () => {
    window.location.hash = '#/';
    expect(isAngularRouteHash()).toBeTruthy();
  });

  it('should know route #%2F to be an angular route hash', () => {
    window.location.hash = '#%2F';
    expect(isAngularRouteHash()).toBeTruthy();
  });

  it('should know route #state=xyz not to be an angular route hash', () => {
    window.location.hash = '#state=xyz';
    expect(isAngularRouteHash()).toBeFalsy();
  });

  it('should get configured', async(async () => {
    await service.bootstrapAuthService();

    verify(oauthService.configure(anything())).called();
  }));

  it('should try login', async(async () => {
    const hash = '#state=xyz';
    window.location.hash = hash;
    await service.bootstrapAuthService();

    const loginOptions = capture(oauthService.tryLoginImplicitFlow).last()[0];
    expect(loginOptions).toBeTruthy();
    expect(loginOptions.customHashFragment).toEqual(hash);
    verify(oauthService.tryLoginImplicitFlow(anything())).called();
  }));

  it('should start implicit flow', async(async () => {
    const hash = '#/foo';
    window.location.hash = hash;

    when(oauthService.hasValidAccessToken()).thenReturn(false);
    await service.bootstrapAuthService();

    verify(oauthService.initImplicitFlow(hash)).called();
  }));

  it('should call initial navigation', async(async () => {
    window.location.hash = '#/foo';

    when(oauthService.hasValidAccessToken()).thenReturn(true);
    await service.bootstrapAuthService();

    verify(router.initialNavigation()).called();
  }));

  it('should start silent refresh', async(async () => {
    window.location.hash = '#/foo';

    when(oauthService.hasValidAccessToken()).thenReturn(true);
    await service.bootstrapAuthService();

    verify(oauthService.setupAutomaticSilentRefresh()).called();
  }));

});
