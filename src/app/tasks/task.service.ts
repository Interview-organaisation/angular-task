import { Injectable } from '@angular/core';
import { Task, Priority } from './task.model';
import { Observable, of, throwError, delay } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly STORAGE_KEY = 'task-manager-tasks';

    constructor(private snackBar: MatSnackBar) { }

    // Getter and setter for tasks in localStorage
    private get tasks(): Task[] {
        const tasksJson = localStorage.getItem(this.STORAGE_KEY);
        return tasksJson ? JSON.parse(tasksJson) : [];
    }

    private set tasks(tasks: Task[]) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }

    // Simulate API error with a 10% chance
    private simulateApiError<T>() {
        if (Math.random() < 0.1) {
            this.snackBar.open('API Error: Operation failed', 'Dismiss', { duration: 3000 });
            return throwError(() => new Error('API Error'));
        }
        return of<T>();
    }

    // Get tasks with optional filtering
    getTasks(filter?: { priority?: Priority | null, status?: string }): Observable<Task[]> {
        return this.simulateApiError<Task[]>().pipe(
            delay(500),
            () => {
                let tasks = this.tasks;

                if (filter) {
                    if (filter.priority) {
                        tasks = tasks.filter(task => task.priority === filter.priority);
                    }

                    if (filter.status === 'completed') {
                        tasks = tasks.filter(task => task.isCompleted);
                    } else if (filter.status === 'incomplete') {
                        tasks = tasks.filter(task => !task.isCompleted);
                    }
                }

                return of(tasks).pipe(delay(500));
            }
        );
    }
    
    // Add a new task
    addTask(task: Omit<Task, 'id' | 'isCompleted'>): Observable<Task> {
        return this.simulateApiError<Task>().pipe(
            delay(500),
            () => {
                const newTask: Task = {
                    ...task,
                    id: Date.now(),
                    isCompleted: false
                };
                this.tasks = [...this.tasks, newTask];
                return of(newTask).pipe(delay(500));
            }
        );
    }

    // Update an existing task
    updateTask(id: number, updates: Partial<Task>): Observable<Task> {
        return this.simulateApiError<Task>().pipe(
            delay(500),
            () => {
                this.tasks = this.tasks.map(task =>
                    task.id === id ? { ...task, ...updates } : task
                );
                const updatedTask = this.tasks.find(task => task.id === id);
                return of(updatedTask!).pipe(delay(500));
            }
        );
    }

    // Delete a task
    deleteTask(id: number): Observable<boolean> {
        return this.simulateApiError<boolean>().pipe(
            delay(500),
            () => {
                this.tasks = this.tasks.filter(task => task.id !== id);
                return of(true).pipe(delay(500));
            }
        );
    }
}