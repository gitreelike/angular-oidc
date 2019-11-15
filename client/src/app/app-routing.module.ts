import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
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
    useHash: true,
    initialNavigation: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
