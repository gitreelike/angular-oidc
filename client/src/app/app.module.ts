import {BrowserModule} from '@angular/platform-browser';
import {ApplicationRef, DoBootstrap, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthModule} from "./auth/auth.module";
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from "./auth/auth.service";
import {FooComponent} from "./foo/foo.component";
import {HelloComponent} from './hello/hello.component';
import {CountdownModule} from "ngx-countdown";
import {ErrorComponent} from "./error/error.component";

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    FooComponent,
    HelloComponent
  ],
  imports: [
    AuthModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CountdownModule
  ],
  providers: [],
  entryComponents: [AppComponent, ErrorComponent]
})
export class AppModule implements DoBootstrap {
  constructor(private authService: AuthService) {}

  ngDoBootstrap(app: ApplicationRef): void {
    this.authService.bootstrapAuthService()
      .then(() => {
        app.bootstrap(AppComponent);
      })
      .catch(error => {
        console.error(`[ngDoBootstrap] Problem while authService.bootstrapAuthService(): ${JSON.stringify(error)}`, error);

        app.bootstrap(ErrorComponent)
      });
  }

}
