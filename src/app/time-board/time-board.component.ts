import { Component, Inject, OnInit } from '@angular/core';
import { TimeService } from '../shared/time.service';
import { TimeDto } from '../shared/time/time';
import { DOCUMENT } from '@angular/common';

export interface TimeItem {
  from: TimeDto;
  to: TimeDto;
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
export class TimeBoardComponent implements OnInit {

  list: TimeItem[] = [];

  calculated: Calc[] = [];

  constructor(private timeService: TimeService,
              @Inject(DOCUMENT) private document: Document) {
    this.addItem();
    this.getList();

    // this.document.addEventListener('keydown', this.keyboardListener);
  }

  ngOnInit(): void {
    // Определяем браузеры
  }

  addItem(): void {
    this.list.push(this.genItem());
  }

  clear(): void {
    this.list = [];
  }

  genItem(): TimeItem {
    return {
      from: this.timeService.getNow(),
      to: null,
      task: ''
    };
  }

  deleteItem(index: number): void {
    this.list.splice(index, 1);
    this.update();
  }

  update(): void {
    this.saveList();
  }

  getTotal(): string {
    const minutes = this.list.reduce((prev, next) => this.timeService.getTime(next) + prev, 0);
    return this.getHourAndMinutes(minutes);
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
    const hour = Math.floor(minutes / 60).toString().padStart(2, '0');
    const min = (minutes - (+hour * 60)).toString().padStart(2, '0');
    return `${hour}:${min}`;
  }

  delete(index: number): void {
    this.calculated.splice(index, 1);
  }

  private keyboardListener = (event: KeyboardEvent) => {
    if (event.code === 'KeyS') {
      event.preventDefault();
      this.saveList();
    }
  }

}
