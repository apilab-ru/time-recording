import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeComponent } from './time/time.component';
import { InputMaskModule } from 'angular5-input-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import { CopyClickDirective } from './copy-click.directive';
import { MyNavComponent } from '../my-nav/my-nav.component';
import { TimeBoardComponent } from '../time-board/time-board.component';
import { StubComponent } from '../stub/stub.component';
import { ItemComponent } from '../time-board/item/item.component';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputMaskModule,
    InputMaskModule,
    LayoutModule,
    MatButtonModule,
    MatIconModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    CopyClickDirective,
    TimeComponent,
    ItemComponent,
    MyNavComponent,
    StubComponent,
    TimeBoardComponent,
  ],
  exports: [
    CopyClickDirective,
    TimeComponent,
    ItemComponent,
    MyNavComponent,
    StubComponent,
    TimeBoardComponent,
  ]
})
export class SharedModule {
}
