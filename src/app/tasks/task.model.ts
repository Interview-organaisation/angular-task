export interface Task {
    id: number;
    name: string;
    description?: string;
    priority: 'Low' | 'Medium' | 'High';
    dueDate: string;
    isCompleted: boolean;
}

export type Priority = Task['priority'];