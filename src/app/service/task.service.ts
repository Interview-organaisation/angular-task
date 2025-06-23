import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  apiUrl = 'http://localhost:3000/';
  constructor(private http: HttpClient) {
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'users');
  }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'categories')
  }
  getAllTaskForUser(userId: number, categoryId: number): Observable<any> {
    const url = `${this.apiUrl}tasks?userId=${userId}&categoryId=${categoryId}`;
    console.log('🟢 API Call URL:', url);
    return this.http.get<any>(url);
  }
  updateTask(task: any) {
    console.log("Updating to:", `${this.apiUrl}tasks/${task.id}`);
    return this.http.put(`${this.apiUrl}tasks/${task.id}`, task);
  }
  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + 'tasks/' + id);
  }

  getAllTasks(): Promise<any> {
    return firstValueFrom(this.http.get<any>(this.apiUrl + 'tasks'));

  }
  async createNewTask(task: any) {
    const tasks = await this.getAllTasks();
    task.id = tasks.length === 0 ? 1 : Math.max(...tasks.map((t: any) => t.id || 0)) + 1;
    return await firstValueFrom(this.http.post(this.apiUrl + 'tasks', task));
  }



}