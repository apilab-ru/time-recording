import { Injectable } from '@angular/core';
import { Cred, JiraApiService, JiraWorkLog, TaskMap } from '@api/services/jira-api.service';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { filter, map, publishReplay, refCount, switchMap, take } from 'rxjs/operators';
import { Calc } from '../models/calc';
import { TimeService } from '@api/services/time.service';

const KEY_STORE = 'jira-integration-store';
const KEY_TASK_MAP = 'jira-integration-task-map';

@Injectable({
  providedIn: 'root'
})
export class JiraStoreService {

  private cred = new BehaviorSubject<Cred | null>(null);
  public cred$ = this.cred.asObservable().pipe(
    filter(store => !!store)
  );

  private taskMap = new BehaviorSubject<TaskMap | null>(null);
  public taskMap$ = this.taskMap.asObservable().pipe(filter(value => !!value));

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
    private timeService: TimeService
  ) {
    this.cred.next(this.loadStore());
    this.taskMap.next(this.loadTaskMap());
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

  /**
   *  @param list
   *  @param date: string = 2020-06-23
   * */
  prepareData(list: Calc[], date: string): (JiraWorkLog & { task: string })[] {
    const taskMap = this.getTaskMap();
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

  getTaskMap(): TaskMap {
    return this.taskMap.getValue();
  }

  saveCred(cred: Cred) {
    this.cred.next({
      ...this.cred.getValue(),
      ...cred
    });
    this.saveStore(this.cred.getValue());
  }

  addTaskMap(): void {
    const value = {
      ...this.taskMap.getValue(),
      'new': null
    };
    this.taskMap.next(value);
    this.saveTaskMap(value);
  }

  updateTaskMap(taskMap: TaskMap): void {
    this.taskMap.next(taskMap);
    this.saveTaskMap(taskMap);
  }

  saveTaskMap(taskMap: TaskMap): void {
    this.taskMap.next(taskMap);
    localStorage.setItem(KEY_TASK_MAP, JSON.stringify(taskMap));
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

  private loadTaskMap(): TaskMap {
    try {
      const data = JSON.parse(localStorage.getItem(KEY_TASK_MAP));
      if (data) {
        return data;
      }
    } catch (e) {
    }

    return {};
  }
}
