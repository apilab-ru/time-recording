import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeService } from '../../../shared/time.service';
import { TimeItem } from '../../../models/time-item';

@Component({
  selector: 'app-time-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {

  @Output() deleteItem = new EventEmitter();

  @Output() updateItem = new EventEmitter<TimeItem>();

  @Input() item: TimeItem = {
    from: null,
    to: null,
    task: '',
    description: null
  };

  constructor(private timeService: TimeService) {
  }

  delete(): void {
    this.deleteItem.emit();
  }

  getTime(): number {
    return this.timeService.getTime(this.item);
  }

  onChange(): void {
    this.updateItem.emit(this.item);
  }

}
