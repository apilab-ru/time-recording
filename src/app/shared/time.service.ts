import { Injectable } from '@angular/core';
import { TimeItem } from '../time-board/time-board.component';
import { TimeDto } from './time/time';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private readonly minutesInHour = 60;

  constructor() {
  }

  getStringTime(time: TimeDto): string {
    if (!time) {
      return '';
    }
    return `${time.hour}:${time.minute.toString().padStart(2, '0')}`;
  }

  getTimeFromString(value: string): TimeDto {
    const [hours, minutes] = value.split(':');

    if (!hours && hours !== '0' && !minutes) {
      return null;
    }

    return {
      hour: +hours,
      minute: +minutes
    };
  }

  getNow(): TimeDto {
    const time = new Date();
    return {
      hour: time.getHours(),
      minute: time.getMinutes()
    };
  }

  getMinutes(time: TimeDto): number {
    if (!time) {
      return 0;
    }

    return time.hour * this.minutesInHour + time.minute;
  }

  getTime(item: TimeItem): number {
    const from = this.getMinutes(item.from);
    let to = this.getMinutes(item.to);

    if (to === 0) {
      to = this.getMinutes(this.getNow());
    }

    if (isNaN(from) || isNaN(to)) {
      return 0;
    }

    if (to < from) {
      to += 24 * this.minutesInHour;
    }

    const div = to - from;

    return (div > 0) ? div : 0;
  }

}
