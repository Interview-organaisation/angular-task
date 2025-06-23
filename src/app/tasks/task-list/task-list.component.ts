import { Component, OnInit, ViewChild } from '@angular/core';
import { Task, Priority } from '../task.model';
import { TaskService } from '../task.service';
import { Observable, catchError, finalize, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @ViewChild(TaskFilterComponent) taskFilterComponent!: TaskFilterComponent;
  tasks: Task[] = [];
  displayedColumns: string[] = ['name', 'description', 'priority', 'dueDate', 'isCompleted', 'actions'];
  loading = false;
  error = false;

  constructor(private taskService: TaskService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  // Initialize the component and load tasks
  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = false;

    const filter = {
      priority: this.taskFilterComponent?.priority?.value,
      status: this.taskFilterComponent?.status?.value
    };

    // Fetch tasks from the service with the applied filter
    this.taskService.getTasks(filter).pipe(
      catchError(() => {
        this.error = true;
        return of([]);
      }),
      finalize(() => this.loading = false)
    ).subscribe(tasks => this.tasks = tasks);
  }

  // Open the dialog to add a new task
  openAddDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  // Open the dialog to edit an existing task
  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  // Change status of a task
  toggleCompletion(task: Task): void {
    this.taskService.updateTask(task.id, { isCompleted: !task.isCompleted })
      .subscribe(() => this.loadTasks());
  }

  // Delete a task with confirmation dialog
  deleteTask(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this task?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(id)
          .subscribe({
            next: () => {
              this.loadTasks();
              this.snackBar.open('Task deleted successfully', 'Close', {
                duration: 3000
              });
            },
            error: () => {
              this.snackBar.open('Failed to delete task', 'Close', {
                duration: 3000
              });
            }
          });
      }
    });
  }
}