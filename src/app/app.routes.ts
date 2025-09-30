import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/movie-list/movie-list.component').then(m => m.MovieListComponent)
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./components/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
