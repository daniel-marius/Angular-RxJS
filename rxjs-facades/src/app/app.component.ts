import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataAccessService } from './data-access/data-access.service';
import { UserState } from './models/state.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  searchTerm: FormControl = this.data.buildSearchTermControl();
  showButton = true;
  title = 'rxjs-facades';
  vm$: Observable<UserState> = this.data.vm$;

  constructor(private data: DataAccessService) {}

  ngOnInit(): void {
    const { criteria }: { criteria: string } = this.data.getStateSnapshot();
    this.searchTerm.patchValue(criteria, { emitEvent: false });
  }

  getPageSize(): void {
    this.showButton = false;
  }

  updatePagination(pageSize: number): void {
    this.data.updatePagination(pageSize);
  }
}
