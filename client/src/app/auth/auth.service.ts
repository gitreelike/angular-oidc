import {Injectable} from '@angular/core';
import {AuthConfig, JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {Router} from "@angular/router";
import {HttpBackend, HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const OIDC_CONFIG_URL = `/oidc-config.json`;

interface FrontendConfig {
  issuer: string;
  clientId: string;
  scope: string;
}

@Injectable()
export class AuthService {

  private http: HttpClient;

  private errorDuringBootstrap: any = undefined;

  constructor(private oauthService: OAuthService,
              private router: Router,
              httpBackend: HttpBackend) {
    this.http = new HttpClient(httpBackend);
  }

  async bootstrapAuthService(): Promise<void> {
    try {
      await this.configureOAuthService();

      await this.tryLogin();

      if (!this.oauthService.hasValidAccessToken()) {
        await this.startImplicitFlow();
      } else {
        this.oauthService.setupAutomaticSilentRefresh();

        this.router.initialNavigation();
      }
    } catch (e) {
      this.errorDuringBootstrap = e;
      throw e;
    }
  }

  public get bootstrapError(): any {
    return this.errorDuringBootstrap;
  }

  private async startImplicitFlow(): Promise<void> {
    const state = isAngularRouteHash() ? window.location.hash : '';
    this.oauthService.initImplicitFlow(state);

    // Stop the boot process of the angular app as the user will be redirected to the auth provider by the above statement.
    await new Promise<void>(() => {});
  }

  private async tryLogin() {
    await this.oauthService.tryLoginImplicitFlow({
      onTokenReceived: info => {
        window.location.hash = info.state;
      },
      customHashFragment: isAngularRouteHash() ? '' : window.location.hash
    });
  }

  private async configureOAuthService() {
    const authConfig: AuthConfig = await this.buildAuthConfig();

    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();

    await this.oauthService.loadDiscoveryDocument();
  }

  private async buildAuthConfig(): Promise<AuthConfig> {
    const frontendConfig = await this.loadFrontendConfig().toPromise();


    const currentLocation = window.location.origin + window.location.pathname;
    const slashIfNeeded = currentLocation.endsWith('/') ? '' : '/';

    return new AuthConfig({
      issuer: frontendConfig.issuer,
      clientId: frontendConfig.clientId,
      scope: frontendConfig.scope,

      redirectUri: currentLocation,
      silentRefreshRedirectUri: `${currentLocation}${slashIfNeeded}silent-refresh.html`,

      clearHashAfterLogin: false
    });
  }

  private loadFrontendConfig(): Observable<FrontendConfig> {
    return this.http.get<FrontendConfig>(OIDC_CONFIG_URL)
  }
}

export function isAngularRouteHash(): boolean {
  const hash = window.location.hash;
  return hash.startsWith('#/') || hash.startsWith('#%2F');
}
