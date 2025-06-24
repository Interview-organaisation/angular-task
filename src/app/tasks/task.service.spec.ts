import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task } from './task.model';

const mockTasks: Task[] = [
  {
    id: 1,
    name: 'Test Task 1',
    description: 'Description 1',
    priority: 'High',
    dueDate: '2025-07-01',
    isCompleted: false
  },
  {
    id: 2,
    name: 'Test Task 2',
    description: 'Description 2',
    priority: 'Low',
    dueDate: '2025-07-02',
    isCompleted: true
  }
];

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
    // Set initial tasks
    mockTasks.forEach(task => service.addTask(task));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get tasks', (done) => {
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBeGreaterThanOrEqual(2);
      done();
    });
  });

  it('should add a task', () => {
    const newTask: Task = {
      id: 3,
      name: 'New Task',
      description: '',
      priority: 'Medium',
      dueDate: '2025-07-03',
      isCompleted: false
    };
    service.addTask(newTask);
    expect(service['taskSubject'].value.some(t => t.id === 3)).toBeTrue();
  });

  it('should update a task', () => {
    const updatedTask = { ...mockTasks[0], name: 'Updated Task' };
    service.updateTask(updatedTask);
    expect(service['taskSubject'].value.find(t => t.id === 1)?.name).toBe('Updated Task');
  });

  it('should delete a task', () => {
    service.deleteTask(1);
    expect(service['taskSubject'].value.find(t => t.id === 1)).toBeUndefined();
  });

  it('should toggle task status', () => {
    const before = service['taskSubject'].value.find(t => t.id === 1)?.isCompleted;
    service.toggleStatus(1);
    const after = service['taskSubject'].value.find(t => t.id === 1)?.isCompleted;
    expect(after).toBe(!before);
  });

  it('should persist tasks to localStorage', () => {
    service.saveTasksToLocalStorage();
    const stored = JSON.parse(localStorage.getItem('tasks') || '[]');
    expect(Array.isArray(stored)).toBeTrue();
    expect(stored.length).toBeGreaterThanOrEqual(2);
  });

  it('should simulate API error 10% of the time', (done) => {
    let errorCount = 0;
    let successCount = 0;
    const tries = 50;
    let completed = 0;
    for (let i = 0; i < tries; i++) {
      service.getTasks().subscribe({
        next: () => { successCount++; check(); },
        error: () => { errorCount++; check(); }
      });
    }
    function check() {
      completed++;
      if (completed === tries) {
        expect(errorCount).toBeGreaterThan(0);
        expect(successCount).toBeGreaterThan(0);
        done();
      }
    }
  });
});
