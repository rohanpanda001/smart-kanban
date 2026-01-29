import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Task, type BoardState, COLUMNS, type ColumnId } from '../types/kanban';

interface BoardStore extends BoardState {
    addTask: (columnId: string, task: Omit<Task, 'id' | 'createdAt' | 'blockedAt' | 'completedAt' | 'columnId'>) => string | null;
    moveTask: (taskId: string, sourceCol: string, destCol: string, destinationIndex: number) => string | null;
    setEditingTask: (taskId: string, columnId: string) => void;
    clearEditingTask: () => void;
    updateTask: (taskId: string, columnId: string, updates: Partial<Task>) => string | null;
    deleteTask: (taskId: string, columnId: string) => void;
    updateSettings: (wipLimitHours: number, blockedStallTimeHours: number) => void;
}

export const useBoardStore = create<BoardStore>()(
    persist(
        (set, get) => ({
            columns: {
                [COLUMNS.BACKLOG]: [],
                [COLUMNS.IN_PROGRESS]: [],
                [COLUMNS.BLOCKED]: [],
                [COLUMNS.DONE]: [],
            },
            wipLimitHours: 20,
            blockedStallTimeHours: 1,
            editingTask: null,

            addTask: (columnId, taskData) => {
                const newTask: Task = {
                    ...taskData,
                    id: crypto.randomUUID(),
                    createdAt: Date.now(),
                    blockedAt: columnId === COLUMNS.BLOCKED ? Date.now() : undefined,
                    columnId: columnId as ColumnId,
                };

                set((state) => ({
                    columns: {
                        ...state.columns,
                        [columnId]: [...state.columns[columnId as ColumnId], newTask],
                    },
                }));

                return null;
            },

            moveTask: (taskId, sourceCol, destCol, destinationIndex) => {
                const { columns, wipLimitHours } = get();
                const taskToMove = columns[sourceCol as ColumnId]?.find((t) => t.id === taskId);

                if (!taskToMove) return "Task not found";

                if (destCol === COLUMNS.IN_PROGRESS) {
                    const currentHours = columns[COLUMNS.IN_PROGRESS].reduce((sum, t) => sum + t.estimate, 0);
                    if (currentHours + taskToMove.estimate > wipLimitHours) {
                        return `WIP Limit Exceeded! Current: ${currentHours}h. Limit: ${wipLimitHours}h.`;
                    }
                }

                const updatedTask = { ...taskToMove, columnId: destCol as ColumnId };
                if (destCol === COLUMNS.DONE) updatedTask.completedAt = Date.now();
                if (destCol === COLUMNS.BLOCKED) updatedTask.blockedAt = Date.now();
                if (sourceCol === COLUMNS.BLOCKED && destCol !== COLUMNS.BLOCKED) delete updatedTask.blockedAt;

                set((state) => {
                    const sCol = sourceCol as ColumnId;
                    const dCol = destCol as ColumnId;
                    const sourceColumnItems = [...state.columns[sCol]];
                    const destColumnItems = sCol === dCol ? sourceColumnItems : [...state.columns[dCol]];

                    // Remove from source
                    sourceColumnItems.splice(sourceColumnItems.findIndex((t) => t.id === taskId), 1);

                    // Add to destination
                    destColumnItems.splice(destinationIndex, 0, updatedTask);

                    return {
                        columns: {
                            ...state.columns,
                            [sCol]: sourceColumnItems,
                            [dCol]: destColumnItems,
                        },
                    };
                });

                return null;
            },

            setEditingTask: (taskId, columnId) => set({ editingTask: { taskId, columnId } }),

            clearEditingTask: () => set({ editingTask: null }),

            updateTask: (taskId, columnId, updates) => {
                console.log({ taskId, columnId, updates });
                const { columns, wipLimitHours } = get();
                const task = columns[columnId as ColumnId].find(t => t.id === taskId);
                if (!task) return "Task not found";

                // WIP Limit check if estimate changes while in 'In Progress'
                if (columnId === COLUMNS.IN_PROGRESS && updates.estimate !== undefined) {
                    const currentTotal = columns[COLUMNS.IN_PROGRESS].reduce((sum, t) => sum + t.estimate, 0);
                    if (currentTotal - task.estimate + updates.estimate > wipLimitHours) {
                        return "WIP limit exceeded for this estimate.";
                    }
                }

                set((state) => ({
                    columns: {
                        ...state.columns,
                        [columnId]: state.columns[columnId as ColumnId].map(t => t.id === taskId ? { ...t, ...updates } : t)
                    }
                }));
                return null;
            },

            deleteTask: (taskId, columnId) => {
                set((state) => ({
                    columns: {
                        ...state.columns,
                        [columnId]: state.columns[columnId as ColumnId].filter((t) => t.id !== taskId),
                    },
                }));
            },

            updateSettings: (wipLimitHours, blockedStallTimeHours) => {
                set({
                    wipLimitHours,
                    blockedStallTimeHours,
                });
            },
        }),
        { name: 'kanban-storage' } // LocalStorage Key
    )
);