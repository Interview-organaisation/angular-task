import { Component, OnInit, inject, Inject } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskFilterComponent } from '../task-filter/task-filter.component';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskFormComponent } from '../task-form/task-form.component';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TaskFilterComponent,
    MatTableModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TaskFormComponent,
    CommonModule,
    DatePipe,
    MatDialogModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  public tasks: Task[] = [];
  public filteredTasks: Task[] = [];
  public displayedColumns: string[] = ['name', 'description', 'priority', 'dueDate', 'isCompleted', 'actions'];
  public selectedTask: Task | null = null;
  public loading = false;
  public filterState: { priority?: string; status?: string } = {};
  private dialog = inject(MatDialog);

  constructor(private taskService: TaskService, private snackBar: MatSnackBar) {}

  /** ngOnInit */
  public ngOnInit(): void {
    this.loadTasks();
  }

  /** load tasks */
  public loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: data => {
        this.tasks = data;
        this.filteredTasks = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load tasks', 'Dismiss', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  /** on filter change */
  public onFilterChange(filter: { priority: string, status: string }): void {
    this.filterState = filter;
    this.filteredTasks = this.tasks.filter(task => {
      const matchesPriority = !filter.priority || task.priority === filter.priority;
      const matchesStatus = !filter.status ||
        (filter.status === 'Completed' && task.isCompleted) ||
        (filter.status === 'Incomplete' && !task.isCompleted);
      return matchesPriority && matchesStatus;
    });
  }

  /** edit task */
  public edit(task: Task): void {
    this.selectedTask = { ...task };
  }

  /** delete task */
  public delete(id: number): void {
    this.openDeleteDialog(() => {
      this.taskService.deleteTask(id);
      this.loadTasks();
    });
  }

  public openDeleteDialog(onConfirm: () => void) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data: {
        title: 'Delete Task',
        message: 'Are you sure you want to delete this task?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        onConfirm();
      }
    });
  }

  /** toggle status */
  public toggleStatus(id: number): void {
    this.taskService.toggleStatus(id);
    this.loadTasks();
  }

  /** onSave */
  public onSave(task: Task): void {
    if (task && typeof task === 'object' && 'id' in task) {
      if (task.id && this.tasks.find(t => t.id === task.id)) {
        this.taskService.updateTask(task);
      } else {
        this.taskService.addTask(task);
      }
      this.selectedTask = null;
      this.loadTasks();
    }
  }
}

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>No</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Yes</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) {}
}
