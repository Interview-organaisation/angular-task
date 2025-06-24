import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './task-filter.component.html',
  styleUrl: './task-filter.component.scss'
})
export class TaskFilterComponent {

  /** emit filter changes */
  @Output() public filterChange = new EventEmitter<{ priority: string, status: string }>();

  /** task filter form */
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      priority: [''],
      status: ['']
    });
    this.form.valueChanges.subscribe(val => this.filterChange.emit(val));
  }
}
