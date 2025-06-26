import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task, Priority } from '../task.model';
import { TaskService } from '../task.service';
import { Observable, catchError, finalize, of } from 'rxjs';

// Custom validator to ensure the due date is in the future
function futureDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if (!control.value) return null;

  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today ? null : { pastDate: true };
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  priorities: Priority[] = ['Low', 'Medium', 'High'];
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {
    // Initialize the form with validation
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)],
      priority: ['', Validators.required],
      dueDate: ['', [Validators.required, futureDateValidator]]
    });
  }

  ngOnInit(): void {
    if (this.data?.task) {
      this.isEditMode = true;
      const task = this.data.task;
      this.taskForm.patchValue({
        name: task.name.trim(),
        description: task.description?.trim(),
        priority: task.priority,
        dueDate: task.dueDate
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.loading = true;
      const formValue = this.taskForm.value;

      let taskObservable: Observable<Task>;

      if (this.isEditMode) {
        // If editing an existing task, use the update method
        taskObservable = this.taskService.updateTask(this.data.task.id, formValue);
      } else {
        // If creating a new task, use the add method
        taskObservable = this.taskService.addTask(formValue);
      }

      taskObservable.pipe(
        catchError(() => of(null)),
        finalize(() => this.loading = false)
      ).subscribe(task => {
        if (task) {
          this.dialogRef.close(true);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get name() { return this.taskForm.get('name'); }
  get description() { return this.taskForm.get('description'); }
  get priority() { return this.taskForm.get('priority'); }
  get dueDate() { return this.taskForm.get('dueDate'); }

  // Error messages for form controls
  get dueDateError() {
    if (this.dueDate?.hasError('pastDate')) {
      return 'Due date must be in the future';
    }
    return this.dueDate?.hasError('required') ? 'Due date is required' : '';
  }
}