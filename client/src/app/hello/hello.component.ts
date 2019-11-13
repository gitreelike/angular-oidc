import { Component, OnInit } from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import * as jwtDecode from "jwt-decode";

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent {

  constructor(private oauthService: OAuthService) {
  }

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  get accessTokenDecoded(): string {
    return this.decodeToken(this.accessToken)
  }

  get accessTokenExpiration(): Date {
    return new Date(this.oauthService.getAccessTokenExpiration());
  }

  get idToken(): string {
    return this.oauthService.getIdToken();
  }

  get idTokenDecoded(): string {
    return this.decodeToken(this.idToken);
  }

  private decodeToken(token: string): string {
    return JSON.stringify(jwtDecode(token), null, 4);
  }

}
