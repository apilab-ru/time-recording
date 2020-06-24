import { Injectable } from '@angular/core';
import { Cred, JiraApiService, JiraWorkLog } from '@api/services/jira-api.service';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { filter, map, publishReplay, refCount, switchMap, take } from 'rxjs/operators';
import { Calc } from '../models/calc';
import { TimeService } from '@api/services/time.service';
import { LINK_TO_TASK } from '../shared/const';

const KEY_STORE = 'jira-integration-store';

@Injectable({
  providedIn: 'root'
})
export class JiraStoreService {

  private store = new BehaviorSubject<Cred | null>(null);

  public cred$ = this.store.asObservable().pipe(
    filter(store => !!store),
  );

  public user$ = this.cred$.pipe(
    switchMap(({domain}) => domain ? this.jiraApi.loadUser(domain) : of(null)),
    publishReplay(1),
    refCount(),
  );

  public isReady$ = this.cred$.pipe(
    map(cred => !!cred && !!cred.login && !!cred.password && !!cred.domain)
  );

  private domain$ = this.cred$.pipe(map(cred => cred.domain));

  constructor(
    private jiraApi: JiraApiService,
    private timeService: TimeService,
  ) {
    this.store.next(this.loadStore());
  }

  export(list: Calc[], date: string): Observable<void[]> {
    const data = this.prepareData(list, date);
    return this.cred$.pipe(
      filter(cred => !!cred),
      take(1),
      switchMap(cred => forkJoin(
        data.map(it => {
          const {task, ...item} = it;
          return this.jiraApi.addWorkLog(cred, task, item);
        })
      ))
    );
  }

  /*
  *  date: 2020-06-23
  * */
  prepareData(list: Calc[], date: string): (JiraWorkLog & {task: string})[] {
    const data: (JiraWorkLog & {task: string})[] = [];
    list.forEach(item => {
      const task = LINK_TO_TASK[item.task] || item.task;
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
    this.store.next({
      ...this.store.getValue(),
      ...cred
    });
    this.saveStore(this.store.getValue());
  }

  private loadStore(): Cred | null {
    try {
      const data = JSON.parse(localStorage.getItem(KEY_STORE));
      if (data) {
        return data;
      }
    } catch (e) {}

    return null;
  }

  private saveStore(store: Cred): void {
    localStorage.setItem(KEY_STORE, JSON.stringify(store));
  }
}
