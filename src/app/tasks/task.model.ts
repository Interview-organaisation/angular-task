// Define the structure of a Task object
export interface Task {
  id: number;                            // Unique ID for each task
  name: string;                          // Task name (required, max 50 characters)
  description?: string;                 // Optional task description (max 200 characters)
  priority: 'Low' | 'Medium' | 'High';   // Priority levels (required)
  dueDate: string;                       // Due date (must be in the future)
  isCompleted: boolean;                  // Completion status
}

// Define the structure of a TaskFilter object
export interface TaskFilter {
  priority: string;
  status: string;
}
