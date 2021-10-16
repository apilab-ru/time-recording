import { Injectable } from '@angular/core';
import { HistoryEvent } from '../models/history-event';
import { State } from '../store/state';


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
    if (this.stateLog.length >= this.minStateLength) {
      this.stateLog.pop();
      return this.stateLog.pop().data;
    } else {
      return null;
    }
  }
}
