import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AutocompleteService, Suggestion } from '../../services/autocomplete.service';

@Component({
  selector: 'app-autocomplete-suggestions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './autocomplete-suggestions.component.html',
  styleUrls: ['./autocomplete-suggestions.component.css']
})
export class AutocompleteSuggestionsComponent implements OnInit, OnDestroy {
  @Input() searchTerm$!: Subject<string>;
  @Input() isVisible = false;
  @Output() suggestionSelected = new EventEmitter<Suggestion>();

  suggestions: Suggestion[] = [];
  private destroy$ = new Subject<void>();

  constructor(private autocompleteService: AutocompleteService) {}

  ngOnInit(): void {
    if (this.searchTerm$) {
      this.autocompleteService.setupAutocomplete(this.searchTerm$)
        .pipe(takeUntil(this.destroy$))
        .subscribe(suggestions => {
          this.suggestions = suggestions;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectSuggestion(suggestion: Suggestion): void {
    this.suggestionSelected.emit(suggestion);
  }
}
