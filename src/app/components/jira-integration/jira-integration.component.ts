import { Component, OnInit } from '@angular/core';
import { JiraStoreService } from '@api/services/jira-store.service';
import { Observable } from 'rxjs';
import { JiraUser, TaskMap } from '@api/services/jira-api.service';

interface KeyArray {
  key: string;
  value: string;
}

@Component({
  selector: 'app-jira-integration',
  templateUrl: './jira-integration.component.html',
  styleUrls: ['./jira-integration.component.scss']
})
export class JiraIntegrationComponent implements OnInit {

  isReady$: Observable<boolean>;
  user$: Observable<JiraUser | null>;

  domain: string;
  login: string;
  password: string;

  taskMap: { key: string, value: string }[];

  constructor(
    private jiraStoreService: JiraStoreService
  ) {
  }

  ngOnInit() {
    this.isReady$ = this.jiraStoreService.isReady$;
    this.user$ = this.jiraStoreService.user$;
    this.jiraStoreService.taskMap$.subscribe(list => this.taskMap = this.fromMapToArray(list));

    this.jiraStoreService.cred$.subscribe(({ domain, login, password }) => {
      this.domain = domain;
      this.login = login;
      this.password = password;
    });
  }

  saveCred(): void {
    this.jiraStoreService.saveCred({
      domain: this.domain,
      login: this.login,
      password: this.password
    });
  }

  logout(): void {
    this.jiraStoreService.saveCred(null);
  }

  addMapItem(): void {
    this.taskMap.push({key: null, value: null});
  }

  deleteTaskItem(index: number): void {
    this.taskMap.splice(index, 1);
    this.jiraStoreService.updateTaskMap(
      this.fromArrayToMap(this.taskMap)
    );
  }

  updateTaskMap(): void {
    this.jiraStoreService.updateTaskMap(this.fromArrayToMap(this.taskMap));
  }

  private fromMapToArray(obj: TaskMap): KeyArray[] {
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
  }

  private fromArrayToMap(list: KeyArray[]): TaskMap {
    return list.reduce((obj, item) => {
      obj[item.key] = item.value;
      return obj;
    }, {});
  }
}
