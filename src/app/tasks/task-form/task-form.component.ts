import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { Task } from "../task.model";

@Component({
  selector: "app-task-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? "Edit Task" : "Add Task" }}</h2>
    <!-- Dialog content for Add/Edit -->
    <mat-dialog-content>
      <!-- Reactive form -->
      <form [formGroup]="taskForm">
        <!-- Form fields: Name, Description, Priority, Due Date -->
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required />
          <mat-error *ngIf="taskForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
          <mat-error *ngIf="taskForm.get('name')?.hasError('maxlength')">
            Name must be 50 characters or less
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description"></textarea>
          <mat-error *ngIf="taskForm.get('description')?.hasError('maxlength')">
            Description must be 200 characters or less
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Priority</mat-label>
          <mat-select formControlName="priority" required>
            <mat-option value="Low">Low</mat-option>
            <mat-option value="Medium">Medium</mat-option>
            <mat-option value="High">High</mat-option>
          </mat-select>
          <mat-error *ngIf="taskForm.get('priority')?.hasError('required')">
            Priority is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Due Date</mat-label>
          <input matInput type="date" formControlName="dueDate" required />
          <mat-error *ngIf="taskForm.get('dueDate')?.hasError('required')">
            Due date is required
          </mat-error>
          <mat-error *ngIf="taskForm.get('dueDate')?.hasError('futureDate')">
            Due date must be in the future
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-button
        color="primary"
        [disabled]="taskForm.invalid"
        (click)="onSubmit()"
      >
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    // Custom styles
    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    mat-dialog-actions {
      justify-content: flex-end;
    }
    textarea {
      min-height: 100px;
    }
  `,
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup; // Reactive form

  constructor(
    private fb: FormBuilder, // Form builder
    public dialogRef: MatDialogRef<TaskFormComponent>, // Dialog reference
    @Inject(MAT_DIALOG_DATA) public data?: Task // Inject task data
  ) {
    // Initialize reactive form
    this.taskForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(50)]], // Name field with required validation and max length
      description: ["", Validators.maxLength(200)], // Description field with max length validation
      priority: ["", Validators.required], // Priority field with required validation
      dueDate: ["", [Validators.required, this.futureDateValidator()]], // Due date field with required and future date validation
    });
  }

  ngOnInit(): void {
    if (this.data) {
      // Fill form fields with existing task data
      this.taskForm.patchValue(this.data);
    }
  }

  // Custom validator to check if due date is in the future
  futureDateValidator() {
    return (control: FormControl) => {
      if (!control.value) {
        return null; // Let Validators.required handle empty values
      }
      const selectedDate = new Date(control.value); // Convert to Date
      const today = new Date(); // Get current date
      today.setHours(0, 0, 0, 0); // Set time to 00:00:00
      return selectedDate > today ? null : { futureDate: true }; // Return null if date is in the future
    };
  }

  // Submit form
  onSubmit(): void {
    // If form is valid
    if (this.taskForm.valid) {
      // Create task object
      const task: Task = {
        id: this.data?.id || 0,
        name: this.taskForm.get("name")?.value,
        description: this.taskForm.get("description")?.value,
        priority: this.taskForm.get("priority")?.value,
        dueDate: this.taskForm.get("dueDate")?.value,
        isCompleted: this.data?.isCompleted || false,
      };
      // Close the dialog and return the task
      this.dialogRef.close(task);
    }
  }

  // Close the dialogue
  onCancel(): void {
    this.dialogRef.close();
  }
}
