import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {

  error: any = undefined;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    if(this.authService.bootstrapError) {
      this.error = JSON.stringify(this.authService.bootstrapError, undefined, 4);
    }
  }

}
