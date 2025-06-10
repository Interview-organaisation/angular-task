import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { TaskFilter } from "../task.model";

@Component({
  selector: "app-task-filter",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  template: `
    <form [formGroup]="filterForm">
      <!-- Priority Filter Dropown -->
      <mat-form-field appearance="fill">
        <mat-label>Priority</mat-label>
        <mat-select formControlName="priority">
          <mat-option value="">All</mat-option>
          <mat-option value="Low">Low</mat-option>
          <mat-option value="Medium">Medium</mat-option>
          <mat-option value="High">High</mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Status Filter Dropown -->
      <mat-form-field appearance="fill">
        <mat-label>Status</mat-label>
        <mat-select formControlName="status">
          <mat-option value="">All</mat-option>
          <mat-option value="completed">Completed</mat-option>
          <mat-option value="incomplete">Incomplete</mat-option>
        </mat-select>
      </mat-form-field>
    </form>
  `,
  styles: `
    // Custom styles
    mat-form-field {
      margin-right: 1rem;
      min-width: 150px;
    }
    form {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
  `,
})
export class TaskFilterComponent {
  @Output() filterChange = new EventEmitter<TaskFilter>(); // Filter change event
  filterForm: FormGroup; // Filter form

  constructor(private fb: FormBuilder) {
    // Initialize filter form
    this.filterForm = this.fb.group({
      priority: [""], // Priority filter
      status: [""], // Status filter
    });

    // Subscribe to form value changes
    this.filterForm.valueChanges.subscribe((value) => {
      this.filterChange.emit(value as TaskFilter);
    });
  }
}
