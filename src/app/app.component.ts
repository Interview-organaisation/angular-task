import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule],
  template: `
    <mat-toolbar color="primary">
      <span>Task Manager</span>
    </mat-toolbar>
    <main style="padding: 16px; max-width: 900px; margin: auto;">
      <router-outlet />
    </main>
  `,
  styles: [],
})
export class AppComponent {}
