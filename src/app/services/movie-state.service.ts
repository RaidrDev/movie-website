import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie, MovieDetails } from '../models/movie.interface';

export interface MovieState {
  movies: Movie[];
  selectedMovie: MovieDetails | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieStateService {
  private initialState: MovieState = {
    movies: [],
    selectedMovie: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0
  };

  private stateSubject = new BehaviorSubject<MovieState>(this.initialState);
  public state$ = this.stateSubject.asObservable();

  // Selectores específicos
  public movies$ = this.state$.pipe(map(state => state.movies));
  public selectedMovie$ = this.state$.pipe(map(state => state.selectedMovie));
  public loading$ = this.state$.pipe(map(state => state.loading));
  public error$ = this.state$.pipe(map(state => state.error));
  public pagination$ = this.state$.pipe(
    map(state => ({
      currentPage: state.currentPage,
      totalPages: state.totalPages
    }))
  );

  constructor() {}

  /**
   * Actualiza el estado de carga
   */
  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  /**
   * Establece las películas en el estado
   */
  setMovies(movies: Movie[], currentPage: number, totalPages: number): void {
    this.updateState({
      movies,
      currentPage,
      totalPages,
      loading: false,
      error: null
    });
  }

  /**
   * Establece la película seleccionada
   */
  setSelectedMovie(movie: MovieDetails): void {
    this.updateState({
      selectedMovie: movie,
      loading: false,
      error: null
    });
  }

  /**
   * Establece un error en el estado
   */
  setError(error: string): void {
    this.updateState({
      error,
      loading: false
    });
  }

  /**
   * Limpia el estado de error
   */
  clearError(): void {
    this.updateState({ error: null });
  }

  /**
   * Resetea el estado a los valores iniciales
   */
  resetState(): void {
    this.stateSubject.next(this.initialState);
  }

  /**
   * Actualiza el estado de forma inmutable
   */
  private updateState(partialState: Partial<MovieState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...partialState };
    this.stateSubject.next(newState);
  }
}
