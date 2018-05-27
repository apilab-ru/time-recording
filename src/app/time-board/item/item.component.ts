import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Time, TimeItem } from '../time-board.component';
import { InputmaskPreset, PipeResult } from 'angular5-input-mask';
import { TimeService } from '../../shared/time.service';

@Component({
  selector: 'app-time-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {

  readonly maxHour = 23;
  readonly maxMinute = 59;
  readonly timeStringLength = 2;
  readonly maxHourFirstDigit = 2;
  readonly maxMinuteFirstDigit = 5;

  private _lastFrom = null;
  private _lastTo = null;

  @Output() deleteItem = new EventEmitter();

  @Input() item: TimeItem = {
    from: {
      minutes: 0,
      hours: 0
    },
    to: {
      minutes: 0,
      hours: 0
    },
    task: ''
  };

  constructor(private timeService: TimeService) {
  }

  get from(): string {
    return this._lastFrom !== null ? this._lastFrom : this.timeService.getStringTime(this.item.from);
  }

  set from(value: string) {
    this._lastFrom = value;
    this.item.from = this.timeService.getTimeFromString(value);
  }

  get to(): string {
    return this._lastTo !== null ? this._lastTo : this.timeService.getStringTime(this.item.to);
  }

  set to(value: string) {
    this._lastTo = value;
    this.item.to = this.timeService.getTimeFromString(value);
  }

  delete(): void {
    this.deleteItem.emit();
  }

  setTo(): void {
    this.item.to = this.timeService.getNow();
  }

  setFrom(): void {
    this.item.from = this.timeService.getNow();
  }

  getTime(): number {
    return this.timeService.getTime(this.item);
  }

  get timePreset(): InputmaskPreset {
    return {
      mask: [/[0-9]/, /[0-9:]/, /[0-9:]/, /[0-9]/, /[0-9]/],
      pipe: this.checkTime.bind(this)
    };
  }

  checkTime(value: string): boolean | string | PipeResult {

    if (!value) {
      return value;
    }

    const indexesOfPipedChars = [];

    let [hour, minute] = value.split(':');

    if (!hour) {
      hour = '';
    }

    if (!minute) {
      minute = '';
    }
    // Если первая цифра часа больше 2, до дописываем 0
    if (+hour.substr(0, 1) > this.maxHourFirstDigit) {
      hour = '0' + hour;
      // При добавлении символа, нам надо написать индекс добавленного символа в массив, для корректной работы inputMask
      indexesOfPipedChars.push(0);
    }
    // Если длина часа больше 2, значит пользователь начал ввод минут
    if (hour.length > this.timeStringLength) {
      minute = minute + hour.substr(this.timeStringLength);
      hour = hour.substr(0, this.timeStringLength);
    }

    if (+hour > this.maxHour) {
      return false;
    }

    let conformedValue = hour;

    if (minute) {
      // Строка с минутами переполнена
      if (minute.length > this.timeStringLength) {
        // В часах исправили час, первый символ лишний
        minute = minute.substr(1, this.timeStringLength);
      }

      // Проверяем первую цифру минут, если больше 5, то дописываем 0
      if (minute.length === 1 && +minute > this.maxMinuteFirstDigit) {
        minute = '0' + minute;
        // Добавленный символ будет поле `:` , значит его индекс hour.length - 1 + 1  => hour.length
        indexesOfPipedChars.push(hour.length);
      }

      if (minute.length > this.timeStringLength) {
        minute = minute.substr(0, this.timeStringLength);
      }

      if (+minute > this.maxMinute) {
        return false;
      }

      conformedValue += ':' + minute;
    }

    return {
      value: conformedValue,
      indexesOfPipedChars
    };
  }

}
