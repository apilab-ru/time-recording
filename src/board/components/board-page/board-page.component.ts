import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardPageComponent {
}
