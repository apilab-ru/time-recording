import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JiraIntegrationComponent } from './componets/jira-integration/jira-integration.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [
    JiraIntegrationComponent,
  ],
  exports: [
    JiraIntegrationComponent,
  ]
})
export class JiraIntegrationModule { }
