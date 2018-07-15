import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeItem } from '../time-board.component';
import { TimeService } from '../../shared/time.service';

@Component({
  selector: 'app-time-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {

  @Output() deleteItem = new EventEmitter();

  @Output() updateItem = new EventEmitter();

  @Input() item: TimeItem = {
    from: null,
    to: null,
    task: ''
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
    this.updateItem.emit();
  }

}
