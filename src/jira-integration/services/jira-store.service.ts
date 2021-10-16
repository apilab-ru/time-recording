import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { filter, map, publishReplay, refCount, switchMap, take } from 'rxjs/operators';
import { Cred, JiraApiService, JiraWorkLog } from './jira-api.service';
import { TimeService } from '../../board/services/time.service';
import { Calc } from '../../board/models/calc';
import { TaskMapService } from '../../board/services/task-map.service';

const KEY_STORE = 'jira-integration-store';

@Injectable({
  providedIn: 'root'
})
export class JiraStoreService {

  private cred = new BehaviorSubject<Cred | null>(null);
  public cred$ = this.cred.asObservable().pipe(
    filter(store => !!store)
  );

  public user$ = this.cred$.pipe(
    switchMap((cred) => cred ? this.jiraApi.loadUser(cred) : of(null)),
    publishReplay(1),
    refCount()
  );

  public isReady$ = this.cred$.pipe(
    map(cred => !!cred && !!cred.login && !!cred.password && !!cred.domain)
  );

  constructor(
    private jiraApi: JiraApiService,
    private timeService: TimeService,
    private taskMapService: TaskMapService,
  ) {
    this.cred.next(this.loadStore());
  }

  export(list: Calc[], date: string): Observable<void[]> {
    const data = this.prepareData(list, date);
    return this.cred$.pipe(
      filter(cred => !!cred),
      take(1),
      switchMap(cred => forkJoin(
        data.map(it => {
          const { task, ...item } = it;
          return this.jiraApi.addWorkLog(cred, task, item);
        })
      ))
    );
  }

  prepareData(list: Calc[], date: string): (JiraWorkLog & { task: string })[] {
    const taskMap = this.taskMapService.getTaskMap();
    const data: (JiraWorkLog & { task: string })[] = [];
    list.forEach(item => {
      const task = taskMap[item.task] || item.task;
      data.push({
        task,
        comment: item.description,
        started: this.formatTime(item, date),
        timeSpentSeconds: item.time * 60
      });
    });
    return data;
  }

  private formatTime(item: Calc, date: string): string {
    const minutes = item.timeStart + (new Date().getTimezoneOffset());
    return date + 'T' + this.timeService.getStringHourMinute(minutes) + ':00.000+0000';
  }

  saveCred(cred: Cred) {
    this.cred.next({
      ...this.cred.getValue(),
      ...cred
    });
    this.saveStore(this.cred.getValue());
  }

  private loadStore(): Cred | null {
    try {
      const data = JSON.parse(localStorage.getItem(KEY_STORE));
      if (data) {
        return data;
      }
    } catch (e) {
    }

    return null;
  }

  private saveStore(store: Cred): void {
    localStorage.setItem(KEY_STORE, JSON.stringify(store));
  }
}
