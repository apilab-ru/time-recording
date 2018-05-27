import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimeBoardComponent } from './time-board/time-board.component';
import { StubComponent } from './stub/stub.component';

const routes: Routes = [
  {
    path: 'time',
    component: TimeBoardComponent
  },
  {
    path: 'stub',
    component: StubComponent
  },
  {
    path: '',
    redirectTo: 'time',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
