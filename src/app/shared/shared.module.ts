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
import { TimeBoardComponent } from '../components/time-board/time-board.component';
import { ItemComponent } from '../components/time-board/item/item.component';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { TimeBoardListComponent } from '../components/time-board/list/list.component';
import { TotalTimePipe } from './total-time.pipe';

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
    TimeBoardComponent,
    TimeBoardListComponent,
    TotalTimePipe,
  ],
  exports: [
    CopyClickDirective,
    TimeComponent,
    ItemComponent,
    TimeBoardComponent,
    TotalTimePipe,
  ]
})
export class SharedModule {
}
