import { Component, OnInit } from '@angular/core';
import { TimeService } from '@api/services/time.service';
import { TimeItem } from '../../models/time-item';
import { Calc } from '../../models/calc';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../store/reducers';
import * as timesAction from '../../store/actions/times';
import { Observable } from 'rxjs';
import { UpdateEvent } from '../../models/update-event';
import { map, switchMap, take } from 'rxjs/operators';
import { HistoryService } from '@api/services/history.service';
import { KeyListenerService } from '@api/services/key-listener.service';
import { MatCheckboxChange } from '@angular/material';
import { ISetting } from '../../models/i-setting';
import { JiraStoreService } from '@api/services/jira-store.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-time-board',
  templateUrl: './time-board.component.html',
  styleUrls: ['./time-board.component.scss']
})
export class TimeBoardComponent implements OnInit {

  list$: Observable<TimeItem[]>;
  calculated$: Observable<Calc[]>;
  setting: ISetting;
  totalTime$: Observable<string>;
  totalHours$: Observable<string>;

  isJiraReady$: Observable<boolean>;

  constructor(
    private timeService: TimeService,
    private store: Store<fromRoot.State>,
    private historyService: HistoryService,
    private keyListenerService: KeyListenerService,
    private jiraStoreService: JiraStoreService,
    private snackBar: MatSnackBar,
  ) {
    this.list$ = store.select(fromRoot.getList);
    this.calculated$ = store.select(fromRoot.getCalcList);
    this.setting = this.timeService.getSetting();
    this.isJiraReady$ = this.jiraStoreService.isReady$;

    const totalTimeMinutes$ = this.list$
      .pipe(
        map(list => list.reduce((prev, next) => this.timeService.getTime(next) + prev, 0))
      );

    this.totalTime$ = totalTimeMinutes$
      .pipe(
        map(minutes => this.timeService.getStringHourMinute(minutes))
      );

    this.totalHours$ = totalTimeMinutes$.pipe(
      map(minutes => (minutes / 60).toFixed(2))
    );
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

  reload(): void {
    this.store.dispatch(new timesAction.Reload());
  }

  genItem(): TimeItem {
    return this.timeService.genItem();
  }

  reCalc(): void {
    this.list$
      .pipe(take(1))
      .subscribe(timeList => {
        this.store.dispatch(new timesAction.SetCalculationList(
          this.timeService.calcTime(timeList, this.timeService.getSetting())
        ));
      });
  }

  changeSort(event: MatCheckboxChange): void {
    const setting = this.timeService.getSetting();
    setting.sort = event.checked;
    this.timeService.saveSetting(setting);
  }

  changeGroup(event: MatCheckboxChange): void {
    const setting = this.timeService.getSetting();
    setting.groupByDescription = event.checked;
    this.timeService.saveSetting(setting);
  }

  changeTimeReorder(event: MatCheckboxChange): void {
    const setting = this.timeService.getSetting();
    setting.timeReorder = event.checked;
    this.timeService.saveSetting(setting);
  }

  getHourAndMinutes(minutes: number): string {
    return this.timeService.getStringHourMinute(minutes);
  }

  delete(index: number): void {
    this.store.dispatch(new timesAction.DeleteCalculationItem(index));
  }

  export(): void {
    const date = new Date();
    const prepareDate = date.getFullYear()
      + '-' + (date.getMonth() + 1).toString().padStart(2, '0')
      + '-' + (date.getDate()).toString().padStart(2, '0');
    const dateString = prompt('Введите дату в формате yyyy-mm-dd', prepareDate);

    this.calculated$.pipe(
      take(1),
      switchMap(list => this.jiraStoreService.export(list, dateString).pipe(
        map(response => ({response, list})))
      )
    ).subscribe(({response, list}) => {
      let hasError = false;
      response.forEach((item, index) => {
        if (item['errorMessages']) {
          hasError = true;
          this.snackBar.open('Error ' + JSON.stringify(list[index]));
        }
      });
      if (!hasError) {
        this.snackBar.open('Успешно выгруженно ');
      }
    });
  }

}
