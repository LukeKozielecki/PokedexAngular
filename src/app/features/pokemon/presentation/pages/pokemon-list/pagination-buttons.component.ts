import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-controls flex justify-center space-x-4 mt-8">
      <button
        class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
        (click)="prevPage.emit()"
        [disabled]="currentOffset === 0"
      >
        Previous
      </button>
      <button
        class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        (click)="nextPage.emit()"
      >
        Next
      </button>
    </div>
  `,
  styles: []
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
