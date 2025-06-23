import { Component, contentChild, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { TaskService } from '../../service/task.service';
import { filter, subscribeOn } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TaskDialogComponent } from '../task-details-dialog/task-details-dialog.component';
import { EditTaskDialogComponent } from '../edit-details-dialog-component/edit-task-dialog.component';
import { AddTaskDialogComponent } from '../../add-task-dialog/add-task-dialog.component';




@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  title: any;
  taskService = inject(TaskService);
  users: any[] = [];
  categories: any[] = [];
  selectedUserId !: number;
  selectedCategoryId !: number;
  inProgressTask: any[] = [];
  completedTask: any[] = [];
  selectedTask: any = {};
  updateTaskForm: FormGroup;
  newTaskForm: FormGroup;


  constructor(private dialog: MatDialog,
    private builder: FormBuilder) {
    this.updateTaskForm = builder.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      isCompleted: [''],
      dueDate: [''],
      userId: [''],
      categoryId: ['']
    })

    this.newTaskForm = builder.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      isCompleted: [''],
      dueDate: ['', Validators.required],
      userId: [''],
      categoryId: ['']
    })
  }

  ngOnInit(): void {
    this.getAllUser();
    this.getAllCategory();
  }
  getAllUser() {
    this.taskService.getAllUsers().subscribe((res: any) => {
      this.users = res;
    })
  }

  getAllCategory() {
    this.taskService.getAllCategories().subscribe((res: any) => {
      this.categories = res;
    })
  }

  getAllTask() {
    this.taskService.getAllTaskForUser(this.selectedUserId, this.selectedCategoryId)
      .subscribe((res: any) => {
        res.forEach((task: any) => {
        });
        this.filterResults(res);
      });

  }

  filterResults(res: any) {
    this.completedTask = [];
    this.inProgressTask = [];

    res.forEach((task: any) => {
      const isDone = task.isCompleted === true || task.isCompleted === 'true';
      const formattedTask = {
        id: task.id,
        name: task.name,
        description: task.description,
        dueDate: task.dueDate,
        isCompleted: isDone,
        userId: task.userId,
        categoryId: task.categoryId
      };

      if (isDone) {
        this.completedTask.push(formattedTask);
      } else {
        this.inProgressTask.push(formattedTask);
      }
    });
  }

  selectTask(task: any) {
    this.selectedTask = task;
    this.updateTaskForm.patchValue({
      ...task,
      title: task.name
    });
  }

  openDialog(task: any) {
    this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task,
    }).afterClosed().subscribe(result => {
      if (result) {
      }
    });

  }

  openEditTaskDialog(task: any) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      data: { ...task }
    });

    dialogRef.afterClosed().subscribe(updatedTask => {
      if (updatedTask) {
        this.taskService.updateTask(updatedTask).subscribe();
      }
    });
  }
  openAddTaskDialog() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '500px',
      data: {
        users: this.users,
        categories: this.categories
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.categoryId = +result.categoryId;
        result.userId = +result.userId;

        this.taskService.createNewTask(result).then(() => {
          this.selectedCategoryId = result.categoryId;
          this.selectedUserId = result.userId;
          this.getAllTask();
        });
      }
    });
  }



  editTask(task: any) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '500px',
      data: task
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(result).subscribe(() => {
          this.getAllTask();
        });
      }
    });
  }

  updatetask() {
    const updatedTask = {
      ...this.selectedTask,
      ...this.updateTaskForm.value
    };
    this.taskService.updateTask(updatedTask).subscribe(() => {
      this.getAllTask();
    });
  }

  deleteTask(task: any) {
    if (confirm("Are You Sure to want to delete task : " + task.name))
      this.taskService.deleteTask(task.id).subscribe((res: any) => {
        this.getAllTask();
      })

  }

  addNewtask() {
    const newTask = this.newTaskForm.value;
    newTask.categoryId = +newTask.categoryId;
    newTask.userId = +newTask.userId;
    this.taskService.createNewTask(newTask).then((data: any) => {
      this.selectedCategoryId = data.categoryId;
      this.selectedUserId = data.userId;
      this.getAllTask();
    });
  }



}


