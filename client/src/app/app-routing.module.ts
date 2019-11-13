import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FooComponent} from "./foo/foo.component";
import {HelloComponent} from "./hello/hello.component";


const routes: Routes = [
  {
    path:      '',
    component: HelloComponent
  },
  {
    path:      'foo',
    component: FooComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
