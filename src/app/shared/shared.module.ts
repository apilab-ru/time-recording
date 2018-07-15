import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeComponent } from './time/time.component';
import { InputMaskModule } from 'angular5-input-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    InputMaskModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  declarations: [
    TimeComponent
  ],
  exports: [
    TimeComponent
  ]
})
export class SharedModule {
}
