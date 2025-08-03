import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-5 text-center">
      <input
        type="text"
        [(ngModel)]="searchTerm"
        (keyup.enter)="onSearch()"
        placeholder="Search Pokemon by name..."
        class="p-2 border border-gray-300 rounded-md mr-2"
      />
      <button
        (click)="onSearch()"
        class="py-2 px-4 bg-red-500 text-white border-none rounded-md cursor-pointer transition-colors duration-200 hover:bg-red-600 active:bg-red-800 active:scale-95 "
      >
        Search
      </button>
    </div>
  `,
  styles: []
})
export class SearchFormComponent {
  searchTerm: string = '';

  @Output() searchSubmitted = new EventEmitter<string>();

  onSearch(): void {
    this.searchSubmitted.emit(this.searchTerm.trim());
  }
}
