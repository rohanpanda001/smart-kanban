import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Task, type BoardState, COLUMNS, type ColumnId } from '../types/kanban';

interface BoardStore extends BoardState {
    addTask: (columnId: string, task: Omit<Task, 'id' | 'createdAt'>) => string | null;
    moveTask: (taskId: string, sourceCol: string, destCol: string, destinationIndex: number) => string | null;
    deleteTask: (taskId: string, columnId: string) => void;
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

            addTask: (columnId, taskData) => {
                const { columns, wipLimitHours } = get();

                if (columnId === COLUMNS.IN_PROGRESS) {
                    const currentHours = columns[COLUMNS.IN_PROGRESS].reduce((sum, t) => sum + t.estimate, 0);
                    if (currentHours + taskData.estimate > wipLimitHours) {
                        return `WIP Limit Exceeded! Cannot add ${taskData.estimate}h task.`;
                    }
                }

                const newTask: Task = {
                    ...taskData,
                    id: crypto.randomUUID(),
                    createdAt: Date.now(),
                    blockedAt: columnId === COLUMNS.BLOCKED ? Date.now() : undefined,
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

                const updatedTask = { ...taskToMove };
                if (destCol === COLUMNS.DONE) updatedTask.completedAt = Date.now();
                if (destCol === COLUMNS.BLOCKED) updatedTask.blockedAt = Date.now();
                if (sourceCol === COLUMNS.BLOCKED && destCol !== COLUMNS.BLOCKED) delete updatedTask.blockedAt;

                set((state) => {
                    const sCol = sourceCol as ColumnId;
                    const dCol = destCol as ColumnId;
                    const sourceColumnItems = [...state.columns[sCol]];
                    const destColumnItems = sCol === dCol ? sourceColumnItems : [...state.columns[dCol]];

                    // Remove from source
                    const [movedItem] = sourceColumnItems.splice(sourceColumnItems.findIndex((t) => t.id === taskId), 1);

                    // Add to destination
                    destColumnItems.splice(destinationIndex, 0, { ...movedItem, ...updatedTask });

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

            deleteTask: (taskId, columnId) => {
                set((state) => ({
                    columns: {
                        ...state.columns,
                        [columnId]: state.columns[columnId as ColumnId].filter((t) => t.id !== taskId),
                    },
                }));
            },
        }),
        { name: 'kanban-storage' } // LocalStorage Key
    )
);