import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { MovieService } from '../../services/movie.service';
import { MovieStateService } from '../../services/movie-state.service';
import { Movie } from '../../models/movie.interface';
import { AutocompleteSuggestionsComponent } from '../autocomplete-suggestions/autocomplete-suggestions.component';
import { Suggestion } from '../../services/autocomplete.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AutocompleteSuggestionsComponent],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit, OnDestroy {
  movies$!: Observable<Movie[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  pagination$!: Observable<{ currentPage: number; totalPages: number }>;

  searchQuery = '';
  showSuggestions = false;
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private autocompleteSubject = new Subject<string>();

  constructor(
    private movieService: MovieService,
    private movieStateService: MovieStateService,
    private router: Router
  ) {
    // Inicializar observables
    this.movies$ = this.movieStateService.movies$;
    this.loading$ = this.movieStateService.loading$;
    this.error$ = this.movieStateService.error$;
    this.pagination$ = this.movieStateService.pagination$;

    // Configurar búsqueda con debounce
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        if (query.trim()) {
          this.searchMovies(query);
        } else {
          this.loadPopularMovies();
        }
      });
  }

  ngOnInit(): void {
    this.loadPopularMovies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga las películas populares
   */
  loadPopularMovies(page: number = 1): void {
    this.movieService.loadPopularMovies(page)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response) {
          this.movieStateService.setMovies(
            response.results,
            response.page,
            response.total_pages
          );
        }
      });
  }

  /**
   * Busca películas por término
   */
  searchMovies(query: string, page: number = 1): void {
    this.movieService.searchMovies(query, page)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response) {
          this.movieStateService.setMovies(
            response.results,
            response.page,
            response.total_pages
          );
        }
      });
  }

  /**
   * Maneja la búsqueda en tiempo real
   */
  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  /**
   * Navega al detalle de una película
   */
  goToMovieDetail(movie: Movie): void {
    this.router.navigate(['/movie', movie.id]);
  }

  /**
   * Obtiene la URL de la imagen de una película
   */
  getMovieImageUrl(movie: Movie): string {
    return this.movieService.getImageUrl(movie.poster_path, 'w300');
  }

  /**
   * Formatea la fecha de lanzamiento
   */
  formatReleaseDate(date: string): string {
    return new Date(date).getFullYear().toString();
  }

  /**
   * Formatea la calificación
   */
  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  /**
   * Maneja el cambio de página
   */
  onPageChange(page: number): void {
    if (this.searchQuery.trim()) {
      this.searchMovies(this.searchQuery, page);
    } else {
      this.loadPopularMovies(page);
    }
  }

  /**
   * Limpia la búsqueda
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.showSuggestions = false;
    this.autocompleteSubject.next('');
    // Ejecutar búsqueda de películas populares
    this.searchSubject.next('');
  }

  /**
   * Maneja el cambio en el input
   */
  onSearchInputChange(): void {
    this.autocompleteSubject.next(this.searchQuery);
    this.showSuggestions = this.searchQuery.length >= 2;
  }

  /**
   * Maneja la selección de una sugerencia
   */
  onSuggestionSelected(suggestion: Suggestion): void {
    this.searchQuery = suggestion.title;
    this.showSuggestions = false;
    this.searchSubject.next(this.searchQuery);
  }

  /**
   * Obtiene el Subject para autocompletado
   */
  get autocompleteTerm$(): Subject<string> {
    return this.autocompleteSubject;
  }

  /**
   * Maneja las teclas presionadas
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.showSuggestions = false;
      this.searchSubject.next(this.searchQuery);
    }
  }
}
