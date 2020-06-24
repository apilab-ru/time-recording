import { Component, OnInit } from '@angular/core';
import { JiraStoreService } from '@api/services/jira-store.service';
import { Observable } from 'rxjs';
import { JiraUser } from '@api/services/jira-api.service';

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

  constructor(
    private jiraStoreService: JiraStoreService,
  ) { }

  ngOnInit() {
    this.isReady$ = this.jiraStoreService.isReady$;
    this.user$ = this.jiraStoreService.user$;

    this.jiraStoreService.cred$.subscribe(({domain, login, password}) => {
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

}
