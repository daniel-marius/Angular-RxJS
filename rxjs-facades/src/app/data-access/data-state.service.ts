import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

export class DataAccessState<T> {
  private state$: BehaviorSubject<T>;

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject<T>(initialState);
  }

  protected get state(): T {
    return this.state$.getValue();
  }

  protected setState(newState: Partial<T>): void {
    this.state$.next({
      ...this.state,
      ...newState,
    });
  }

  protected select<K>(mapFn: (state: T) => K): Observable<K> {
    return this.state$.asObservable().pipe(
      map((state: T) => mapFn(state)),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true }),
    )
  }
}
