import { Directive, HostListener, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Directive({
  selector: '[appCopyClick]'
})
export class CopyClickDirective {

  @Input() appCopyClick: string;

  @HostListener('click', ['$event']) onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.copy(this.appCopyClick);
    this.snackBar.open(`Скопировано: ${this.appCopyClick}`, null, {
      duration: 20000
    });
  }

  constructor(private snackBar: MatSnackBar) {
  }

  copy(str): void {
    const tmp = document.createElement('INPUT'); // Создаём новый текстовой input
    const focus = document.activeElement; // Получаем ссылку на элемент в фокусе (чтобы не терять фокус)

    tmp['value'] = str; // Временному input вставляем текст для копирования

    document.body.appendChild(tmp); // Вставляем input в DOM
    tmp['select'](); // Выделяем весь текст в input
    document.execCommand('copy'); // Магия! Копирует в буфер выделенный текст (см. команду выше)
    document.body.removeChild(tmp); // Удаляем временный input
    focus['focus'](); // Возвращаем фокус туда, где был
  }
}
