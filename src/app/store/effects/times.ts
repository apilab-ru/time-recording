import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { TimeService } from '@api/services/time.service';
import { filter, switchMap } from 'rxjs/operators';
import * as timesAction from '../../store/actions/times';
import { of } from 'rxjs';
import { RELOAD, UNDO } from '../../store/actions/times';
import { HistoryService } from '@api/services/history.service';

const EffectsInit = '@ngrx/effects/init';

@Injectable()
export class TimesEffects {

  constructor(
    private actions$: Actions,
    private timeService: TimeService,
    private historyService: HistoryService,
  ) {
  }

  @Effect()
  loadBaseState$ = this.actions$.pipe(
    filter(action => action.type === EffectsInit),
    switchMap(() => {
      const list = this.timeService.getList();
      return of(new timesAction.SetList(list));
    })
  );

  @Effect()
  undoState$ = this.actions$.pipe(
    filter(action => action.type === UNDO),
    switchMap(() => {
      const state = this.historyService.prevent();
      return of(new timesAction.UndoData(state));
    })
  );

  @Effect()
  reloadState$ = this.actions$.pipe(
    filter(action => action.type === RELOAD),
    switchMap(() => {
      const list = prompt('Set list');
      return of(new timesAction.SetList(JSON.parse(list)));
    })
  );

}
