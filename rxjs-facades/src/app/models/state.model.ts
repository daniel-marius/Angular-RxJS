import { User } from './user.model';
import { Pagination } from './pagination.model';

export interface UserState {
  users: User[];
  pagination: Pagination;
  criteria: string;
  loading: boolean;
}

export const initialState: UserState = {
  users: [],
  criteria: '',
  pagination: {
    currentPage: 0,
    selectedSize: 5,
    pageSizes: [5, 10, 20, 50],
  },
  loading: false,
};
