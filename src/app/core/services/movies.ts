import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie } from '../models/movie.model';

@Service()
export class Movies {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.moviesApiUrl}/movies`;

  getAll(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.baseUrl);
  }
}
