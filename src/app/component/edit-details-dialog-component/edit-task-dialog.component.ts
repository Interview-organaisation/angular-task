import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './edit-task-dialog.component.html',
  styleUrl: './edit-task-dialog.component.css'
})
export class EditTaskDialogComponent {
  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description],
      isCompleted: [data.isCompleted],
      dueDate: [data.dueDate],
      userId: [data.userId],
      categoryId: [data.categoryId]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const updatedTask = {
        id: this.data.id,
        ...this.form.value
      };
      this.dialogRef.close(updatedTask);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}