export const COLUMNS = {
    BACKLOG: 'Backlog',
    IN_PROGRESS: 'In Progress',
    BLOCKED: 'Blocked',
    DONE: 'Done',
} as const;

export type ColumnId = typeof COLUMNS[keyof typeof COLUMNS];

export const PRIORITIES = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
} as const;

export type Priority = typeof PRIORITIES[keyof typeof PRIORITIES];

export interface Task {
    id: string;
    title: string;
    assignee: string;
    estimate: number;
    priority: Priority;
    createdAt: number;
    blockedAt?: number;
    completedAt?: number;
    columnId: ColumnId;
}

export interface BoardState {
    columns: Record<ColumnId, Task[]>;
    wipLimitHours: number;
    blockedStallTimeHours: number;
    editingTask: { taskId: string; columnId: string } | null;
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'blockedAt' | 'completedAt'>;

export interface FormData {
    title: string;
    assignee: string;
    estimate: number;
    priority: Priority;
}