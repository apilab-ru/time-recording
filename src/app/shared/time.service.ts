import { Injectable } from '@angular/core';
import { Time, TimeItem } from '../time-board/time-board.component';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() {
  }

  getStringTime(time: Time): string {
    if (!time) {
      return '';
    }
    return `${time.hours}:${time.minutes}`;
  }

  getTimeFromString(value: string): Time {
    const [hours, minutes] = value.split(':');
    return {
      hours: +hours,
      minutes: +minutes
    };
  }

  getNow(): Time {
    const time = new Date();
    return {
      hours: time.getHours(),
      minutes: time.getMinutes()
    };
  }

  getTime(item: TimeItem): number {
    const from = item.from.hours * 60 + item.from.minutes;
    let to = item.to.hours * 60 + item.to.minutes;

    if(to === 0) {
      to = this.getNow().hours * 60 + this.getNow().minutes;
    }

    if (isNaN(from) || isNaN(to)) {
      return 0;
    }

    const div = to - from;

    return (div > 0) ? div : 0;
  }

}
