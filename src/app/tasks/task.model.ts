export interface Task {
  id: number;
  name: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string; // ISO format
  isCompleted: boolean;
}