import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { delay, finalize } from "rxjs/operators";
import { Task } from "./task.model";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private tasks: Task[] = []; // Array to store tasks
  private tasksSubject = new BehaviorSubject<Task[]>([]); // Subject to emit tasks
  private loadingSubject = new BehaviorSubject<boolean>(true); // Start as true for initial load
  private STORAGE_KEY = "tasks"; // Key for local storage

  constructor() {
    // Load tasks on app start
    this.loadTasks();
  }

  // Load Tasks - Load tasks from local storage on app start
  private loadTasks(): void {
    const storedTasks = localStorage.getItem(this.STORAGE_KEY);
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      this.tasksSubject.next([...this.tasks]);
    }
    this.loadingSubject.next(false);
  }

  // Save Tasks - Save tasks to local storage
  private saveTasks(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    this.tasksSubject.next([...this.tasks]); // Ensure new array reference
  }

  // Get Tasks - Get all tasks
  getTasksObservable(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  // Get Loading State - Get loading state
  getLoadingState(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  // Add Task - Add new task
  addTask(task: Task): Observable<Task> {
    this.loadingSubject.next(true);
    return new Observable<Task>((observer) => {
      try {
        if (Math.random() < 0.1) {
          throw new Error("Failed to add task");
        }
        const newTask = {
          ...task,
          id: this.tasks.length
            ? Math.max(...this.tasks.map((t) => t.id)) + 1
            : 1,
        };
        this.tasks.push(newTask);
        this.saveTasks();
        observer.next(newTask);
        observer.complete();
      } catch (err) {
        observer.error(err);
      }
    }).pipe(
      delay(500),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // Update Task - Update task details
  updateTask(task: Task): Observable<Task> {
    this.loadingSubject.next(true);
    return new Observable<Task>((observer) => {
      try {
        if (Math.random() < 0.1) {
          throw new Error("Failed to update task");
        }
        const index = this.tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = task;
          this.saveTasks();
          observer.next(task);
          observer.complete();
        } else {
          throw new Error("Task not found");
        }
      } catch (err) {
        observer.error(err);
      }
    }).pipe(
      delay(500),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // Delete Task - Delete task by id
  deleteTask(id: number): Observable<void> {
    this.loadingSubject.next(true);
    return new Observable<void>((observer) => {
      try {
        if (Math.random() < 0.1) {
          throw new Error("Failed to delete task");
        }
        this.tasks = this.tasks.filter((t) => t.id !== id);
        this.saveTasks();
        observer.next();
        observer.complete();
      } catch (err) {
        observer.error(err);
      }
    }).pipe(
      delay(500),
      finalize(() => this.loadingSubject.next(false))
    );
  }
}
