import {Injectable} from '@angular/core';
import {AuthConfig, JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {Router} from "@angular/router";

const OIDC_CONFIG_URL = `/oidc-config.json`;

interface FrontendConfig {
  issuer: string;
  clientId: string;
  scope: string;
}

@Injectable()
export class AuthService {

  private errorDuringBootstrap: any = undefined;

  constructor(private oauthService: OAuthService,
              private router: Router) {}

  async bootstrapAuthService(): Promise<void> {
    await this.configureOAuthService();

    await this.tryLogin();

    if (!this.oauthService.hasValidAccessToken()) {
      await this.startImplicitFlow();
    } else {
      this.oauthService.setupAutomaticSilentRefresh();

      this.router.initialNavigation();
    }
  }

  private async startImplicitFlow(): Promise<void> {
    const state = isAngularRouteHash() ? window.location.hash : '';
    this.oauthService.initImplicitFlow(state);
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
    const currentLocation = window.location.origin + window.location.pathname;
    const slashIfNeeded = currentLocation.endsWith('/') ? '' : '/';

    return new AuthConfig({
      issuer: 'http://localhost:8080/auth/realms/example',
      clientId: 'angular-with-oidc',
      scope: 'openid profile',

      redirectUri: currentLocation,
      silentRefreshRedirectUri: `${currentLocation}${slashIfNeeded}silent-refresh.html`,

      clearHashAfterLogin: false
    });
  }

}

export function isAngularRouteHash(): boolean {
  const hash = window.location.hash;
  return hash.startsWith('#/') || hash.startsWith('#%2F');
}
