import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Movies } from '../../../core/services/movies';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movies-list',
  imports: [DecimalPipe],
  templateUrl: './movies-list.html',
  styleUrl: './movies-list.css',
})
export class MoviesList implements OnInit {
  private readonly moviesService = inject(Movies);

  readonly movies = signal<Movie[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.moviesService.getAll().subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load movies. Please try again later.');
        this.loading.set(false);
      },
    });
  }
}
