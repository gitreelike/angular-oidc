import {Injectable} from '@angular/core';
import {AuthConfig, JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {Observable, of} from 'rxjs';

const OIDC_CONFIG_URL = `/oidc-config.json`;

interface FrontendConfig {
  issuer: string;
  clientId: string;
  scope: string;
}

@Injectable()
export class AuthService {

  private errorDuringBootstrap: any = undefined;

  constructor(private oauthService: OAuthService) {}

  async bootstrapAuthService(): Promise<void> {
    await this.configureOAuthService();

    await this.oauthService.tryLoginImplicitFlow();


    if (!this.oauthService.hasValidAccessToken()) {
      this.oauthService.initImplicitFlow();
    } else {
      this.oauthService.setupAutomaticSilentRefresh();
    }
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
      silentRefreshRedirectUri: `${currentLocation}${slashIfNeeded}silent-refresh.html`
    });
  }

}

export function isAngularRouteHash(): boolean {
  const hash = window.location.hash;
  return hash.startsWith('#/') || hash.startsWith('#%2F');
}
