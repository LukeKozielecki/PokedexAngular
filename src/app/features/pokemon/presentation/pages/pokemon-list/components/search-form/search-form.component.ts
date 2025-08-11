import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {debounceTime, distinctUntilChanged, Subject, Subscription, tap} from 'rxjs';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-form.html',
  styleUrl: './search-form.scss'
})
export class SearchFormComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  selectedType: string = '';
  pokemonTypes = [
    'normal',
    'electric',
    'fire',
    'water',
    'grass',
    'dark',
    'fairy',
    'psychic',
    'poison',
    'bug',
    'fighting',
    'ice',
    'ghost',
    'dragon',
    'steel',
    'rock',
    'ground',
    'flying'
  ];

  @Output() searchSubmitted = new EventEmitter<{ term: string; types: string[] }>();

  private searchTerms = new Subject<string>();
  private subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.emitSearchPayload())
    ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSearchInput(): void {
    this.searchTerms.next(this.searchTerm);
  }

  onTypeSelected(): void {
    this.emitSearchPayload();
  }

  private emitSearchPayload(): void {
    const typesToFilter = this.selectedType ? [this.selectedType] : [];
    this.searchSubmitted.emit({
      term: this.searchTerm.trim(),
      types: typesToFilter
    });
  }
}
