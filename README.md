
# ✅ Angular Task Manager – Practical Assignment

---

## 📌 Objective

Build a **Task Manager** app using:

- Angular 18
- TypeScript
- RxJS
- Angular Material
- SCSS

The app should allow users to:

- Add, view, edit, and delete tasks
- Filter tasks by priority and completion status
- Toggle task completion status
- Persist tasks using `localStorage`
- Simulate API latency and errors

---

## 🧰 Tech Stack

- Angular 18
- Angular CLI
- Angular Material
- RxJS
- SCSS
- TypeScript

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- **Node.js v20.x**: [Download](https://nodejs.org)
- **Angular CLI v18**: `npm install -g @angular/cli@18`


### 2. Project Setup

```bash
ng new task-manager --style=scss --routing --minimal
cd task-manager
ng add @angular/material
```

> Choose the **Indigo-Pink** theme when prompted.

```bash
npm install
ng serve
```

Then open: `http://localhost:4200`

---

## 🗂️ Folder Structure (Recommended)

```plaintext
src/app/
├── tasks/
│   ├── task.model.ts
│   ├── task.service.ts
│   ├── task-list/
│   │   ├── task-list.component.ts 
│   ├── task-form/
│   │   ├── task-form.component.ts 
│   ├── task-filter/
│   │   ├── task-filter.component.ts 
│   ├── tasks.module.ts
├── app.module.ts
```

---

## 🧩 Features

### 📋 Task List

- Shows list of tasks in a `mat-table`
- Columns: Name, Description, Priority, Due Date, Status (Completed/Incomplete)

### ➕ Add / ✏️ Edit Task

- Reactive Form with validations:
  - `name`: Required, max 50 characters
  - `description`: Optional, max 200 characters
  - `priority`: Required (`Low | Medium | High`)
  - `dueDate`: Required, must be future date

### 🔍 Filter Tasks

- Combined filter by:
  - `priority` (Low/Medium/High)
  - `status` (Completed/Incomplete)

### ✅ Toggle Task Status

- Use a checkbox or toggle switch

### 💾 localStorage

- Persist task list using `localStorage`
- Load on app start

### 🔁 API Simulation (with Error Handling)

- Use `RxJS` and `delay(500)` to simulate latency
- Simulate 10% error using `throwError`

```ts
return Math.random() < 0.1
  ? throwError(() => new Error('Failed to fetch tasks'))
  : of(this.tasks).pipe(delay(500));
```

- Show friendly messages via `MatSnackBar`

---

## 🧪 Optional Enhancements

- ✅ Loading spinner with `mat-spinner`
- ✅ Unit tests for `TaskService` using Jasmine/Karma
- ✅ Mobile-first responsiveness

---

## 📅 Timeline (5 Hours)



## 📝 Sample Data 

```json
[
  {
    "id": 1,
    "name": "Complete project proposal",
    "description": "Draft proposal for client meeting",
    "priority": "High",
    "dueDate": "2025-06-05",
    "isCompleted": false
  },
  {
    "id": 2,
    "name": "Review code",
    "description": "Review pull request for team",
    "priority": "Medium",
    "dueDate": "2025-06-03",
    "isCompleted": true
  }
]
```

---


## 🚀 Submission

To submit your solution, please follow the steps below:

1. **Fork this repository** to your own GitHub account.
2. **Create a new branch** named after yourself (e.g., `feature/your-name`).
3. **Implement your solution** with **clear and meaningful comments** throughout your code to explain your logic and approach.
4. **Create a Pull Request (PR)** from your branch to the `main` branch of this repository.
5. **Send the link to your PR** via email to [hr@mconnectmedia.com](mailto:hr@mconnectmedia.com).

> ⚠️ Make sure your code is clean, well-commented, and follows good development practices.

---


## 📬 Contact

For questions, email: [hr@mconnectmedia.com](mailto:hr@mconnectmedia.com)  


---

> 🎯 **Tip**: Focus on core features first. Complete, tested features are better than half-built extras.
