import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel, MatOption, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-add-task-dialog',
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    MatTooltipModule,
    CommonModule, MatNativeDateModule,
  ],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.css'
})
export class AddTaskDialogComponent {
  newTaskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.newTaskForm = this.fb.group({
      userId: ['', Validators.required],
      categoryId: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.newTaskForm.valid) {
      this.dialogRef.close(this.newTaskForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}