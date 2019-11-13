import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {AuthService} from "./auth.service";
import {OAuthModule} from "angular-oauth2-oidc";

@NgModule({
  imports:      [
    CommonModule,
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  declarations: [],
  providers:    [
    AuthService
  ],
})
export class AuthModule {
}
