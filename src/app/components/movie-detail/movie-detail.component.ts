import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, Observable } from 'rxjs';

import { MovieService } from '../../services/movie.service';
import { MovieStateService } from '../../services/movie-state.service';
import { MovieDetails } from '../../models/movie.interface';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  movie$!: Observable<MovieDetails | null>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private movieStateService: MovieStateService
  ) {
    this.movie$ = this.movieStateService.selectedMovie$;
    this.loading$ = this.movieStateService.loading$;
    this.error$ = this.movieStateService.error$;
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const movieId = +params['id'];
        if (movieId) {
          this.loadMovieDetails(movieId);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los detalles de una película
   */
  private loadMovieDetails(movieId: number): void {
    this.movieService.loadMovieDetails(movieId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(movie => {
        if (movie) {
          this.movieStateService.setSelectedMovie(movie);
        }
      });
  }

  /**
   * Navega de vuelta al listado
   */
  goBack(): void {
    this.router.navigate(['/']);
  }

  /**
   * Obtiene la URL de la imagen de fondo
   */
  getBackdropUrl(movie: MovieDetails): string {
    return this.movieService.getImageUrl(movie.backdrop_path, 'original');
  }

  /**
   * Obtiene la URL del póster
   */
  getPosterUrl(movie: MovieDetails): string {
    return this.movieService.getImageUrl(movie.poster_path, 'w500');
  }

  /**
   * Formatea la duración en horas y minutos
   */
  formatRuntime(runtime: number): string {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  }

  /**
   * Formatea la fecha de lanzamiento
   */
  formatReleaseDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatea el presupuesto
   */
  formatBudget(budget: number): string {
    if (budget === 0) return 'No disponible';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(budget);
  }

  /**
   * Formatea los ingresos
   */
  formatRevenue(revenue: number): string {
    if (revenue === 0) return 'No disponible';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(revenue);
  }

  /**
   * Formatea la calificación
   */
  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  /**
   * Obtiene el color de la calificación basado en el valor
   */
  getRatingColor(rating: number): string {
    if (rating >= 8) return '#10b981'; // Verde
    if (rating >= 6) return '#f59e0b'; // Amarillo
    if (rating >= 4) return '#f97316'; // Naranja
    return '#ef4444'; // Rojo
  }

  /**
   * Obtiene los nombres de los géneros
   */
  getGenreNames(movie: MovieDetails): string {
    return movie.genres.map(genre => genre.name).join(', ');
  }

  /**
   * Obtiene los nombres de los países de producción
   */
  getProductionCountries(movie: MovieDetails): string {
    return movie.production_countries.map(country => country.name).join(', ');
  }

  /**
   * Obtiene los nombres de los idiomas
   */
  getSpokenLanguages(movie: MovieDetails): string {
    return movie.spoken_languages.map(lang => lang.name).join(', ');
  }

  /**
   * Obtiene la URL de una imagen
   */
  getImageUrl(path: string | null, size?: 'w200' | 'w300' | 'w500' | 'original'): string {
    return this.movieService.getImageUrl(path, size);
  }
}
