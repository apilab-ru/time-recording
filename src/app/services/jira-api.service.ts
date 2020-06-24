import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
};

@Injectable({
  providedIn: 'root'
})
export class JiraApiService {

  constructor(private http: HttpClient) {
  }

  loadUser(domain: string): Observable<JiraUser> {
    return this.http.get<JiraUser>(domain + '/rest/api/2/myself');
  }

  addWorkLog(cred: Cred, task: string, data: JiraWorkLog): Observable<void> {
    return this.http.post<void>('/server/add-worklog.php?' + Math.random(), {
      send: data,
      task,
      cred
    });
  }

}
