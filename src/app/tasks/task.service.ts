import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
  private taskSubject = new BehaviorSubject<Task[]>(this.tasks);

  public getTasks(): Observable<Task[]> {
    return Math.random() < 0.1
      ? throwError(() => new Error('Failed to fetch tasks'))
      : of(this.taskSubject.value).pipe(delay(500));
  }

  public saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.taskSubject.value));
  }

  public addTask(task: Task) {
    const newTasks = [...this.taskSubject.value, task];
    this.taskSubject.next(newTasks);
    this.saveTasksToLocalStorage();
  }

  public updateTask(task: Task) {
    const updated = this.taskSubject.value.map(t => t.id === task.id ? task : t);
    this.taskSubject.next(updated);
    this.saveTasksToLocalStorage();
  }

  public deleteTask(id: number) {
    const filtered = this.taskSubject.value.filter(t => t.id !== id);
    this.taskSubject.next(filtered);
    this.saveTasksToLocalStorage();
  }

  public toggleStatus(id: number) {
    const updated = this.taskSubject.value.map(t =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    this.taskSubject.next(updated);
    this.saveTasksToLocalStorage();
  }
}
