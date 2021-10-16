import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cred {
  domain: string;
  login: string;
  password: string;
}

export interface JiraWorkLog {
  comment: string;
  started: string;
  timeSpentSeconds: number;
}

export interface JiraUser {
  self: string;
  key: string;
  name: string;
  emailAddress: string;
  'avatarUrls': {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
  'displayName': string;
  'active': boolean;
  'timeZone': string;
  'locale': string;
}

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {
  private endpoint = environment.api;

  constructor(private http: HttpClient) {
  }

  loadUser(cred: Cred): Observable<JiraUser> {
    return this.http.post<JiraUser>(this.endpoint + 'load-user.php', {
      cred
    });
  }

  addWorkLog(cred: Cred, task: string, data: JiraWorkLog): Observable<void> {
    return this.http.post<void>(this.endpoint + 'add-worklog.php', {
      send: data,
      task,
      cred
    });
  }

}
