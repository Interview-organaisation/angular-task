import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatError } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatError,
    ReactiveFormsModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnChanges {

  /** task */
  @Input() public task: Task | null = null;

  /** emit data after save */
  @Output() public save = new EventEmitter<Task>();

  /** create/edit form */
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [Date.now()],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]],
      priority: ['', Validators.required],
      dueDate: ['', [Validators.required, this.futureDateValidator]],
      isCompleted: [false]
    });
  }

  /** ngOnChanges */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.form.patchValue(this.task);
      this.form.markAsPristine();
      this.form.markAsUntouched();
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.setErrors(null);
      });
      this.form.updateValueAndValidity();
    } else if (!this.task) {
      this.form.reset({
        id: Date.now(),
        name: '',
        description: '',
        priority: '',
        dueDate: '',
        isCompleted: false
      });
      this.form.markAsPristine();
      this.form.markAsUntouched();
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.setErrors(null);
      });
      this.form.updateValueAndValidity();
    }
  }

  /** submit form */
  public submitForm(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
      // Reset form and clear validation state
      this.form.reset({
        id: Date.now(),
        name: '',
        description: '',
        priority: '',
        dueDate: '',
        isCompleted: false
      });
      // Clear validation/touched state
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.setErrors(null);
        this.form.get(key)?.markAsPristine();
        this.form.get(key)?.markAsUntouched();
      });
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.form.updateValueAndValidity();
    }
  }

  /** future date validator */
  public futureDateValidator(control: any) {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const now = new Date();
    now.setHours(0,0,0,0);
    if (inputDate <= now) {
      return { notFuture: true };
    }
    return null;
  }
}
