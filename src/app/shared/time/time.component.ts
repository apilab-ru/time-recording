import { Component, forwardRef } from '@angular/core';
import { TimeDto } from './time';
import { TimeService } from '../time.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputmaskPreset, PipeResult } from 'angular5-input-mask';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimeComponent), multi: true },
  ]
})
export class TimeComponent implements ControlValueAccessor {

  value: TimeDto;

  private _valueString: string;

  private propagateChange: (value) => {};

  readonly maxHour = 23;
  readonly maxMinute = 59;
  readonly timeStringLength = 2;
  readonly maxHourFirstDigit = 2;
  readonly maxMinuteFirstDigit = 5;

  constructor(private timeService: TimeService) { }

  get valueString(): string {
    return this._valueString;
  }

  set valueString(value: string) {
    this._valueString = value;
    this.value = this.timeService.getTimeFromString(value);
    this.propagateChange(this.value);
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

  writeValue(value: TimeDto): void {
    this.value = value;
    this._valueString = this.timeService.getStringTime(value);
  }

  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn): void {
  }

  setNow(): void {
    this.value = this.timeService.getNow();
    this.valueString = this.timeService.getStringTime(this.value);
  }

}
