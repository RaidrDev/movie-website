import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { 
  debounceTime, 
  distinctUntilChanged, 
  switchMap, 
  catchError, 
  filter 
} from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Suggestion {
  id: number;
  title: string;
  year?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  private readonly baseUrl = environment.tmdbBaseUrl;
  private readonly apiKey = environment.tmdbApiKey;

  // Cache simple
  private cache = new Map<string, Suggestion[]>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private cacheTimestamps = new Map<string, number>();

  // Estado
  private suggestionsSubject = new BehaviorSubject<Suggestion[]>([]);
  public suggestions$ = this.suggestionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Configura el autocompletado con debounce
   */
  setupAutocomplete(searchTerm$: Observable<string>): Observable<Suggestion[]> {
    return searchTerm$.pipe(
      // Solo términos de 2+ caracteres
      filter(term => term.length >= 2),
      
      // Debounce de 300ms
      debounceTime(300),
      
      // Evitar términos duplicados
      distinctUntilChanged(),
      
      // Buscar sugerencias
      switchMap(term => this.getSuggestions(term)),
      
      // Manejar errores
      catchError(error => {
        console.error('Error en autocompletado:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene sugerencias con cache
   */
  private getSuggestions(term: string): Observable<Suggestion[]> {
    const normalizedTerm = term.toLowerCase().trim();
    
    // Verificar cache
    if (this.isCacheValid(normalizedTerm)) {
      const cached = this.cache.get(normalizedTerm);
      if (cached) {
        this.suggestionsSubject.next(cached);
        return of(cached);
      }
    }

    // Hacer petición
    return this.searchMovies(normalizedTerm).pipe(
      switchMap(response => {
        const suggestions = this.processSuggestions(response);
        
        // Guardar en cache
        this.cache.set(normalizedTerm, suggestions);
        this.cacheTimestamps.set(normalizedTerm, Date.now());
        
        // Actualizar estado
        this.suggestionsSubject.next(suggestions);
        return of(suggestions);
      })
    );
  }

  /**
   * Busca películas
   */
  private searchMovies(query: string): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', environment.tmdbDefaultLanguage)
      .set('query', query)
      .set('page', '1');

    return this.http.get(`${this.baseUrl}/search/movie`, { params });
  }

  /**
   * Procesa las sugerencias
   */
  private processSuggestions(response: any): Suggestion[] {
    if (!response.results) return [];

    return response.results
      .slice(0, 5) // Máximo 5 sugerencias
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        year: item.release_date ? new Date(item.release_date).getFullYear().toString() : undefined
      }))
      .filter((item: Suggestion) => item.title);
  }

  /**
   * Verifica si el cache es válido
   */
  private isCacheValid(term: string): boolean {
    const timestamp = this.cacheTimestamps.get(term);
    if (!timestamp) return false;
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  /**
   * Limpia las sugerencias
   */
  clearSuggestions(): void {
    this.suggestionsSubject.next([]);
  }
}
