import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeComponent } from './time/time.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCheckboxModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import { CopyClickDirective } from './copy-click.directive';
import { TimeBoardComponent } from '../components/time-board/time-board.component';
import { ItemComponent } from '../components/time-board/item/item.component';
import { RouterModule } from '@angular/router';
import { TimeBoardListComponent } from '../components/time-board/list/list.component';
import { TotalTimePipe } from './total-time.pipe';
import { NgxMaskModule } from 'ngx-mask';
import { JiraIntegrationComponent } from '../components/jira-integration/jira-integration.component';
import { TimeDtoPipe } from './time-dto.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatCheckboxModule,
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
    JiraIntegrationComponent,
    TimeDtoPipe,
  ],
  exports: [
    CopyClickDirective,
    TimeComponent,
    ItemComponent,
    TimeBoardComponent,
    TotalTimePipe,
    JiraIntegrationComponent,
    TimeDtoPipe,
  ],
})
export class SharedModule {
}
