import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { MovieApiService } from './movie-api.service';
import { MovieStateService } from './movie-state.service';
import { Movie, MovieDetails, MovieResponse } from '../models/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(
    private movieApiService: MovieApiService,
    private movieStateService: MovieStateService
  ) {}

  /**
   * Carga las películas populares
   */
  loadPopularMovies(page: number = 1): Observable<MovieResponse | null> {
    this.movieStateService.setLoading(true);
    this.movieStateService.clearError();

    return this.movieApiService.getPopularMovies(page).pipe(
      catchError(error => {
        this.movieStateService.setError('Error al cargar las películas');
        console.error('Error loading movies:', error);
        return of(null);
      })
    );
  }

  /**
   * Carga los detalles de una película
   */
  loadMovieDetails(movieId: number): Observable<MovieDetails | null> {
    this.movieStateService.setLoading(true);
    this.movieStateService.clearError();

    return this.movieApiService.getMovieDetails(movieId).pipe(
      catchError(error => {
        this.movieStateService.setError('Error al cargar los detalles de la película');
        console.error('Error loading movie details:', error);
        return of(null);
      })
    );
  }

  /**
   * Busca películas por término
   */
  searchMovies(query: string, page: number = 1): Observable<MovieResponse | null> {
    this.movieStateService.setLoading(true);
    this.movieStateService.clearError();

    return this.movieApiService.searchMovies(query, page).pipe(
      catchError(error => {
        this.movieStateService.setError('Error al buscar películas');
        console.error('Error searching movies:', error);
        return of(null);
      })
    );
  }

  /**
   * Obtiene la URL de una imagen
   */
  getImageUrl(path: string | null, size?: 'w200' | 'w300' | 'w500' | 'original'): string {
    return this.movieApiService.getImageUrl(path, size);
  }

  /**
   * Obtiene el estado de la aplicación
   */
  getState() {
    return this.movieStateService;
  }
}
