import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pagination } from '../models/pagination.model';
import { User, RandomUserResponse } from '../models/user.model';
import { buildUserUrl, filterWithCriteria } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class DataAccessApi {
  constructor(private http: HttpClient) {}

  findAllUsers(criteria: string, pagination: Pagination): Observable<User[]> {
    const url = buildUserUrl(criteria, pagination);
    return this.http.get<RandomUserResponse>(url).pipe(
      map(({ results }: RandomUserResponse) => results),
      map(filterWithCriteria(criteria))
    );
  }
}
