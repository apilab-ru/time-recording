import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavComponent } from './my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { TimeBoardComponent } from './time-board/time-board.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { StubComponent } from './stub/stub.component';
import { ItemComponent } from './time-board/item/item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputMaskModule } from 'angular5-input-mask';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    MyNavComponent,
    TimeBoardComponent,
    StubComponent,
    ItemComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    InputMaskModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
