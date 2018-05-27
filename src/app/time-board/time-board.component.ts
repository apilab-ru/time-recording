import { Component, OnChanges } from '@angular/core';
import { TimeService } from '../shared/time.service';

export interface Time {
  hours: number;
  minutes: number;
}

export interface TimeItem {
  from: Time;
  to: Time;
  task: string;
}

export interface Calc {
  task: string;
  time: number;
}

@Component({
  selector: 'app-time-board',
  templateUrl: './time-board.component.html',
  styleUrls: ['./time-board.component.scss']
})
export class TimeBoardComponent implements OnChanges {

  list: TimeItem[] = [];

  calculated: Calc[] = [];

  constructor(private timeService: TimeService) {
    this.addItem();
    this.addItem();
    this.addItem();

    this.getList();
  }

  addItem(): void {
    this.list.push(this.genItem());
  }

  clear(): void {
    this.list = [];
  }

  genItem(): TimeItem {
    return {
      from: {
        hours: 0,
        minutes: 0
      },
      to: {
        hours: 0,
        minutes: 0
      },
      task: ''
    };
  }

  deleteItem(index: number): void {
    this.list.splice(index, 1);
  }

  getTotal(): number {
    const minutes = this.list.reduce((prev, next) => this.timeService.getTime(next) + prev, 0);
    return minutes / 60;
  }

  saveList(): void {
    localStorage['today'] = JSON.stringify(this.list);
  }

  getList(): void {
    const list = localStorage['today'];
    if (list) {
      this.list = JSON.parse(list);
    }
  }

  ngOnChanges(): void {
    this.saveList();
  }

  reCalc(): void {
    this.calculated = [];

    this.list.forEach(item => {
      const index = this.calculated.findIndex(it => it.task === item.task);
      if (index !== -1) {
        this.calculated[index].time += this.timeService.getTime(item);
      } else {
        this.calculated.push({
          task: item.task,
          time: this.timeService.getTime(item)
        });
      }
    });

    this.calculated.sort((a, b) => {
      return a.task === b.task ? 0 :
        (a.task > b.task ? 1 : -1);
    });
  }

  getHourAndMinutes(minutes: number): string {
    const hour = Math.floor(minutes / 60);
    const min = (minutes - (hour * 60)).toString().padStart(2, '0');
    return `0${hour}:${min}`;
  }

}
