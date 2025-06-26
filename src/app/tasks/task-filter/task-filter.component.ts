import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Priority } from '../task.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent {
  @Output() filterChange = new EventEmitter<void>();

  filterForm: FormGroup;
  priorities: Priority[] = ['Low', 'Medium', 'High'];
  statuses = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'incomplete', label: 'Incomplete' }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      priority: [''],
      status: ['all']
    });

    // Emit filter change on form value changes with debounce
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.filterChange.emit());
  }

  get priority() { return this.filterForm.get('priority'); }
  get status() { return this.filterForm.get('status'); }
}