import { Observable, combineLatest } from 'rxjs';
import {
  map,
  filter,
  pairwise,
  distinctUntilChanged,
  switchMap,
  startWith,
  tap,
  debounceTime,
} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Pagination } from '../models/pagination.model';
import { RouteHistory } from '../models/route.history.model';
import { User } from '../models/user.model';
import { UserState, initialState } from '../models/state.model';
import { DataAccessApi } from './data-api.service';
import { DataAccessState } from './data-state.service';
import { withPreviousItem } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class DataAccessService extends DataAccessState<UserState> {
  readonly criteria$: Observable<string> = this.select(
    (state: UserState) => state.criteria
  );

  readonly loading$: Observable<boolean> = this.select(
    (state: UserState) => state.loading
  );

  readonly pagination$: Observable<Pagination> = this.select(
    (state: UserState) => state.pagination
  );

  readonly users$: Observable<User[]> = this.select(
    (state: UserState) => state.users
  );

  readonly routeHistory$: Observable<RouteHistory | undefined> = this.select(
    (state: UserState) => state.routeHistory
  );

  readonly vm$: Observable<UserState> = combineLatest([
    this.pagination$,
    this.criteria$,
    this.users$,
    this.loading$,
  ]).pipe(
    map(
      ([pagination, criteria, users, loading]: [
        Pagination,
        string,
        User[],
        boolean
      ]) => ({
        pagination,
        criteria,
        users,
        loading,
      })
    )
  );

  private previousUrl: string = '';
  private currentUrl: string = '';
  private routeHistory: string[] = [];

  constructor(private dataApi: DataAccessApi, private readonly router: Router) {
    super(initialState);

    combineLatest([this.criteria$, this.pagination$])
      .pipe(
        switchMap(([criteria, pagination]: [string, Pagination]) =>
          this.dataApi.findAllUsers(criteria, pagination)
        ),
        tap({
          next: (users: User[]): void => {
            this.setState({ ...this.state, users, loading: false });
          },
          error: (error): void => {
            console.log(error);
          },
          complete: (): void => {},
        })
      )
      .subscribe();

    this.users$
      .pipe(
        withPreviousItem<User[]>(),
        tap((data) => console.log(data))
      )
      .subscribe();

    this.routeHistory$.pipe(tap((data) => console.log(data))).subscribe();

    this.router.events
      .pipe(
        filter(
          (event): event is RoutesRecognized =>
            event instanceof RoutesRecognized
        ),
        pairwise(),
        tap((events: RoutesRecognized[]) => {
          const previousUrl: string = events[0].urlAfterRedirects;
          console.log(previousUrl);
        })
      )
      .subscribe();
  }

  buildSearchTermControl(): FormControl {
    const searchTerm: FormControl = new FormControl('', Validators.required);
    searchTerm.valueChanges
      .pipe(
        startWith(''),
        debounceTime(100),
        distinctUntilChanged(),
        tap((value) => this.updateSearchCriteria(value as string))
      )
      .subscribe();
    return searchTerm;
  }

  buildRouteHistory(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        tap((event: NavigationEnd) => {
          const tempUrl: string = this.currentUrl;
          this.previousUrl = tempUrl;
          this.currentUrl = event.urlAfterRedirects;
          this.routeHistory.push(event.urlAfterRedirects);
          this.setState({
            ...this.state,
            routeHistory: {
              previousUrl: this.previousUrl,
              currentUrl: this.currentUrl,
              routes: this.routeHistory,
            },
          });
        })
      )
      .subscribe();
  }

  getStateSnapshot(): UserState {
    return { ...this.state, pagination: { ...this.state.pagination } };
  }

  updatePagination(selectedSize: number, currentPage: number = 0): void {
    const pagination: Pagination = {
      ...this.state.pagination,
      currentPage,
      selectedSize,
    };
    this.setState({ ...this.state, pagination, loading: true });
  }

  updateSearchCriteria(criteria: string): void {
    this.setState({ ...this.state, criteria, loading: true });
  }
}
