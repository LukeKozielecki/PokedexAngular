import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-form.html',
  styleUrl: './search-form.scss'
})
export class SearchFormComponent {
  searchTerm: string = '';

  @Output() searchSubmitted = new EventEmitter<string>();

  onSearch(): void {
    this.searchSubmitted.emit(this.searchTerm.trim());
  }
}
