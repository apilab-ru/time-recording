import { Component, OnInit } from '@angular/core';
import { TimeService } from '../../shared/time.service';
import { TimeItem } from '../../models/time-item';
import { Calc } from '../../models/calc';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../store/reducers';
import * as timesAction from '../../store/actions/times';
import { Observable } from 'rxjs';
import { UpdateEvent } from '../../models/update-event';
import { map, take } from 'rxjs/operators';
import { HistoryService } from '../../shared/history.service';
import { KeyListenerService } from '../../shared/key-listener.service';

@Component({
  selector: 'app-time-board',
  templateUrl: './time-board.component.html',
  styleUrls: ['./time-board.component.scss']
})
export class TimeBoardComponent implements OnInit {

  list$: Observable<TimeItem[]>;

  calculated$: Observable<Calc[]>;

  constructor(
    private timeService: TimeService,
    private store: Store<fromRoot.State>,
    private historyService: HistoryService,
    private keyListenerService: KeyListenerService,
  ) {
    this.list$ = store.select(fromRoot.getList);
    this.calculated$ = store.select(fromRoot.getCalcList);
  }

  ngOnInit(): void {
    this.keyListenerService
      .listener(['ControlLeft', 'KeyZ'])
      .subscribe(() => {
        this.store.dispatch(new timesAction.Undo());
      });

    this.keyListenerService
      .listener(['ControlLeft', 'KeyQ'])
      .subscribe(() => {
        this.reCalc();
      });
  }

  get totalTime(): Observable<string> {
    return this.list$
      .pipe(
        map(list => {
          const minutes = list.reduce((prev, next) => this.timeService.getTime(next) + prev, 0);
          return this.timeService.getStringHourMinute(minutes);
        })
      );
  }

  undo(): void {
    this.store.dispatch(new timesAction.Undo());
  }

  onUpdateItem(event: UpdateEvent): void {
    this.store.dispatch(new timesAction.Update(event));
  }

  onDeleteItem(index: number): void {
    this.store.dispatch(new timesAction.Delete(index));
  }

  addItem(): void {
    this.store.dispatch(new timesAction.Add(this.genItem()));
  }

  clear(): void {
    this.store.dispatch(new timesAction.Clear());
  }

  genItem(): TimeItem {
    return this.timeService.genItem();
  }

  reCalc(): void {
    this.list$
      .pipe(take(1))
      .subscribe(timeList => {
        this.store.dispatch(new timesAction.SetCalculationList(
          this.timeService.calcTime(timeList)
        ));
      });
  }

  getHourAndMinutes(minutes: number): string {
    return this.timeService.getStringHourMinute(minutes);
  }

  delete(index: number): void {
    this.store.dispatch(new timesAction.DeleteCalculationItem(index));
  }

}
