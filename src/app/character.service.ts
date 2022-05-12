import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, concatMap, map, Observable, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

export interface Character {
  name: string;
  birth_year: string;
  height: string;
  mass: string;
}

export interface CharacterInterface {
  count: number;
  next: string;
  previous: string;
  results: Array<Character>;
}

@Injectable()
export class CharacterService {
  url = `${environment.api}/people`;

  constructor(private http: HttpService) { }

  public getCharacter(pageNumber: number): Observable<any> {
    return this.http.get<any>(`${this.url}?page=${pageNumber}`).pipe(
      map(res => res.results)
    )
  }

  public getData(): Observable<CharacterInterface> {
    return this.http.get<CharacterInterface>(this.url);
  }
}
