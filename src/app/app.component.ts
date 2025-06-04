import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaskListComponent } from "./tasks/task-list/task-list.component";
import { TaskFilterComponent } from "./tasks/task-filter/task-filter.component";
import { Task, TaskFilter } from "./tasks/task.model";
import { Observable, combineLatest, BehaviorSubject } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { TaskService } from "./tasks/task.service";
import { TaskFormComponent } from "./tasks/task-form/task-form.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    TaskListComponent,
    TaskFilterComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="container">
      <h1 class="header">Task Manager</h1>
      <!-- Filter and Add Task -->
      <div class="header-row">
        <app-task-filter
          (filterChange)="onFilterChange($event)"
        ></app-task-filter>
        <button mat-raised-button color="primary" (click)="openAddTaskDialog()">
          <mat-icon>add</mat-icon> Add Task
        </button>
      </div>
      <ng-container *ngIf="isLoading$ | async; else content">
        <mat-spinner diameter="50"></mat-spinner>
      </ng-container>
      <!-- Task List -->
      <ng-template #content>
        <app-task-list [tasks]="(filteredTasks$ | async) || []"></app-task-list>
      </ng-template>
    </div>
  `,
  styles: `
    /* Global styles */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    .header {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      font-weight: 500;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      min-height: 56px; /* Match mat-form-field height */
    }
    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 40px; /* Match filter input height */
    }
    mat-spinner {
      margin: 2rem auto;
      display: block;
    }
  `,
})
export class AppComponent {
  filteredTasks$!: Observable<Task[]>; // Observable for filtered tasks
  isLoading$!: Observable<boolean>; // Observable for loading state

  // Filter subject
  private filterSubject = new BehaviorSubject<TaskFilter>({
    priority: "",
    status: "",
  });

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // Get tasks and loading state
    this.isLoading$ = this.taskService.getLoadingState().pipe(startWith(true));
    // Get filtered tasks
    this.filteredTasks$ = combineLatest([
      this.taskService.getTasksObservable(),
      this.filterSubject.asObservable(),
    ]).pipe(
      map(([tasks, filters]) => this.filterTasks(tasks, filters)),
      startWith([])
    );
  }

  // Handle filter changes
  onFilterChange(filters: TaskFilter): void {
    this.filterSubject.next(filters);
  }

  // Open add task dialog
  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.addTask(result).subscribe({
          next: () => {
            this.snackBar.open("Task added successfully", "Close", {
              duration: 3000,
            });
          },
          error: (err) =>
            this.snackBar.open(err.message, "Close", { duration: 3000 }),
        });
      }
    });
  }

  // Filter tasks based on the provided filters
  private filterTasks(tasks: Task[], filters: TaskFilter): Task[] {
    return tasks.filter((task) => {
      const matchesPriority =
        !filters.priority || task.priority === filters.priority;
      const matchesStatus =
        !filters.status ||
        (filters.status === "completed" && task.isCompleted) ||
        (filters.status === "incomplete" && !task.isCompleted);
      return matchesPriority && matchesStatus;
    });
  }
}
