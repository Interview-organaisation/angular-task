import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-details-dialog.component.html',
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,

  ]
})
export class TaskDialogComponent {
  saveTask() {
    throw new Error('Method not implemented.');
  }
  taskForm: FormGroup;
  isViewMode: boolean = false;
  mode: 'view' | 'edit' = 'view';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TaskDialogComponent>
  ) {
    this.taskForm = this.fb.group({
      name: [data.task?.name],
      description: [data.task?.description],
      isCompleted: [data.task?.isCompleted],
      dueDate: [data.task?.dueDate]
    });

    if (data.mode === 'view') {
      this.taskForm.disable();
    }
  }
  onClose(): void {
    this.dialogRef.close();
  }

  onOk(): void {
    this.dialogRef.close(this.taskForm.value);
  }


}
