import { OperatorFunction, pipe } from 'rxjs';
import { map, pairwise, startWith } from 'rxjs';
import { Pagination } from '../models/pagination.model';

export function buildUserUrl(criteria: string, pagination: Pagination): string {
  const URL = 'https://randomuser.me/api/';
  const currentPage = `page=${pagination.currentPage}`;
  const pageSize = `results=${pagination.selectedSize}&`;
  const searchFor = `seed=mindspaceDemo&inc=gender,name,nat`;

  return `${URL}?${searchFor}&${pageSize}&${currentPage}`;
}

export function contains(src: string, part: string): boolean {
  return (src || '').toLowerCase().indexOf(part.toLowerCase()) > -1;
}

export function filterWithCriteria(criteria: string) {
  return (list: any[]) =>
    list.filter((item: any) => matchUser(item?.name, criteria));
}

export function matchUser(who: any, criteria: string): boolean {
  const inFirst: boolean = contains(who?.first, criteria);
  const inLast: boolean = contains(who?.last, criteria);
  return !!criteria ? inFirst || inLast : true;
}

// Custom RxJS Operator
export function withPreviousItem<T>(): OperatorFunction<
  T,
  {
    previous?: T;
    current?: T;
  }
> {
  return pipe(
    startWith(undefined),
    pairwise(),
    map(([previous, current]: [T | undefined, T | undefined]) => ({
      previous,
      current: current!,
    }))
  );
}
