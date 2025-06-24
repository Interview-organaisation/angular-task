import { Routes } from '@angular/router';
import { TaskListComponent } from './tasks/task-list/task-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' as 'full' },
  { path: 'tasks', component: TaskListComponent },
  // Future: add more routes if needed
];
