import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { META_REDUCERS, MetaReducer, StoreModule } from '@ngrx/store';
import { reducers, State } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { TimesEffects } from './store/effects/times';
import { logger } from './store/reducers/logger';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HistoryService } from '@api/services/history.service';
import { HttpClientModule } from '@angular/common/http';

export function getMetaReducers(
  historyService: HistoryService
): MetaReducer<State>[] {
  return [
    logger(historyService)
  ];
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([TimesEffects]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
  ],
  providers: [
    {
      provide: META_REDUCERS,
      deps: [HistoryService],
      useFactory: getMetaReducers,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
