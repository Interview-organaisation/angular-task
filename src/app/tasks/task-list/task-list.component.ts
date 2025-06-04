import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { TaskService } from "../task.service";
import { Task } from "../task.model";
import { TaskFormComponent } from "../task-form/task-form.component";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
  ],
  template: `
    <table mat-table [dataSource]="tasks" class="mat-elevation-z8">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let task">{{ task.name }}</td>
      </ng-container>
      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let task">{{ task.description }}</td>
      </ng-container>
      <ng-container matColumnDef="priority">
        <th mat-header-cell *matHeaderCellDef>Priority</th>
        <td mat-cell *matCellDef="let task">{{ task.priority }}</td>
      </ng-container>
      <ng-container matColumnDef="dueDate">
        <th mat-header-cell *matHeaderCellDef>Due Date</th>
        <td mat-cell *matCellDef="let task">{{ task.dueDate }}</td>
      </ng-container>
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let task">
          <mat-checkbox
            [checked]="task.isCompleted"
            (change)="toggleTaskStatus(task)"
          >
          </mat-checkbox>
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let task">
          <button
            mat-icon-button
            color="primary"
            (click)="editTask(task)"
            aria-label="Edit task"
          >
            <mat-icon>edit</mat-icon>
          </button>
          <button
            mat-icon-button
            color="warn"
            (click)="deleteTask(task.id)"
            aria-label="Delete task"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
    <div *ngIf="tasks.length === 0" class="no-tasks-message">
      No tasks available
    </div>
  `,
  styles: `
    table {
      width: 100%;
      margin-bottom: 1rem;
    }
    .mat-icon-button {
      margin-left: 0.5rem;
    }
    .no-tasks-message {
      text-align: center;
      padding: 1rem;
      font-size: 1.2rem;
      color: #666;
    }
  `,
})
export class TaskListComponent implements OnInit {
  @Input() tasks: Task[] = []; // Task LIst Array
  displayedColumns: string[] = [ // All column name to display
    "name",
    "description",
    "priority",
    "dueDate",
    "status",
    "actions",
  ];

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  // Toggle Task Status - Change task status
  toggleTaskStatus(task: Task): void {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        this.snackBar.open("Task status updated", "Close", { duration: 3000 });
      },
      error: (err) =>
        this.snackBar.open(err.message, "Close", { duration: 3000 }),
    });
  }

  // Edit Task - Update task details
  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: task,
    });

    // After update and close the dialogue event handeling
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.updateTask(result).subscribe({
          next: () => {
            // Show success message on complete edit
            this.snackBar.open("Task updated successfully", "Close", {
              duration: 3000,
            });
          },
          error: (err) =>
            this.snackBar.open(err.message, "Close", { duration: 3000 }),
        });
      }
    });
  }

  // Delete Task
  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        // Show success message on complete delete
        this.snackBar.open("Task deleted successfully", "Close", {
          duration: 3000,
        });
      },
      error: (err) =>
        this.snackBar.open(err.message, "Close", { duration: 3000 }),
    });
  }
}
