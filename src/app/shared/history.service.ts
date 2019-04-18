import { Injectable } from '@angular/core';
import { State } from '../store/reducers/times';
import { HistoryEvent } from '../models/history-event';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private stateLog: HistoryEvent<State>[] = [];

  private readonly minStateLength = 2;

  addState(state: State): void {
    const date = new Date();
    this.stateLog.push({
      dateTime: date.toLocaleDateString() + ` ${date.getHours()}:${date.getMinutes()}`,
      data: JSON.parse(JSON.stringify(state))
    });
  }

  prevent(): State {
    if (this.minStateLength) {
      this.stateLog.pop();
      return this.stateLog.pop().data;
    } else {
      return null;
    }
  }

  get list(): HistoryEvent<State>[] {
    return this.stateLog;
  }
}
