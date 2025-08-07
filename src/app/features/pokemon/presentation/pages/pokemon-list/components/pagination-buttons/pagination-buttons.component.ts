import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./pagination-buttons.html',
  styleUrl: './pagination-buttons.scss',
})
export class PaginationButtonsComponent {
  /**
   * The current offset value from the parent component.
   * Used to determine if the "Previous" button should be disabled.
   */
  @Input() currentOffset: number | null = 0;

  @Output() nextPage = new EventEmitter<void>();

  @Output() prevPage = new EventEmitter<void>();

  constructor() { }
}
