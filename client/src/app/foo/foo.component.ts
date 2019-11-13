import { Component, OnInit } from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import {CountdownConfig} from "ngx-countdown";

@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html'
})
export class FooComponent {

  config: CountdownConfig = {};

  constructor(oauthService: OAuthService) {
    this.config.leftTime = (oauthService.getAccessTokenExpiration() - Date.now()) / 1000;
  }

}
