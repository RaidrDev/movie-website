import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, MovieDetails, MovieResponse } from '../models/movie.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  private readonly baseUrl = environment.tmdbBaseUrl;
  private readonly apiKey = environment.tmdbApiKey;
  private readonly imageBaseUrl = environment.tmdbImageBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las películas populares
   */
  getPopularMovies(page: number = 1): Observable<MovieResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', environment.tmdbDefaultLanguage)
      .set('page', page.toString());

    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/popular`, { params });
  }

  /**
   * Obtiene los detalles de una película específica
   */
  getMovieDetails(movieId: number): Observable<MovieDetails> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', environment.tmdbDefaultLanguage);

    return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${movieId}`, { params });
  }

  /**
   * Obtiene la URL completa de una imagen
   */
  getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500'): string {
    if (!path) {
      return 'https://placehold.co/300x450?text=Sin+Imagen';
    }
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  /**
   * Obtiene películas por término de búsqueda
   */
  searchMovies(query: string, page: number = 1): Observable<MovieResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', environment.tmdbDefaultLanguage)
      .set('query', query)
      .set('page', page.toString());

    return this.http.get<MovieResponse>(`${this.baseUrl}/search/movie`, { params });
  }
}
