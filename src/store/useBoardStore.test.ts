import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBoardStore } from './useBoardStore';
import { COLUMNS, PRIORITIES } from '../types/kanban';

// Mock crypto.randomUUID
const mockUUID = 'test-uuid-123';
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: () => mockUUID
    }
});

describe('useBoardStore', () => {
    beforeEach(() => {
        useBoardStore.setState({
            columns: {
                [COLUMNS.BACKLOG]: [],
                [COLUMNS.IN_PROGRESS]: [],
                [COLUMNS.BLOCKED]: [],
                [COLUMNS.DONE]: []
            },
            wipLimitHours: 12,
            blockedStallTimeHours: 24,
            editingTask: null
        });
        vi.useFakeTimers();
    });

    it('should initialize with default state', () => {
        const state = useBoardStore.getState();
        expect(state.columns[COLUMNS.BACKLOG]).toEqual([]);
        expect(state.wipLimitHours).toBe(12);
    });

    it('should add a task correctly', () => {
        const store = useBoardStore.getState();
        const newTask = {
            title: 'Test Task',
            priority: PRIORITIES.MEDIUM,
            estimate: 2,
            assignee: 'User'
        };

        store.addTask(COLUMNS.BACKLOG, newTask);

        const updatedState = useBoardStore.getState();
        const addedTask = updatedState.columns[COLUMNS.BACKLOG][0];

        expect(addedTask).toBeTruthy();
        expect(addedTask.title).toBe(newTask.title);
        expect(addedTask.id).toBe(mockUUID);
        expect(addedTask.columnId).toBe(COLUMNS.BACKLOG);
    });

    it('should move a task between columns', () => {
        const store = useBoardStore.getState();
        const task = {
            title: 'Move Me',
            priority: PRIORITIES.HIGH,
            estimate: 3,
            assignee: 'User'
        };
        store.addTask(COLUMNS.BACKLOG, task);

        // Move from BACKLOG to IN_PROGRESS
        store.moveTask(mockUUID, COLUMNS.BACKLOG, COLUMNS.IN_PROGRESS, 0);

        const updatedState = useBoardStore.getState();
        expect(updatedState.columns[COLUMNS.BACKLOG]).toHaveLength(0);
        expect(updatedState.columns[COLUMNS.IN_PROGRESS]).toHaveLength(1);
        expect(updatedState.columns[COLUMNS.IN_PROGRESS][0].columnId).toBe(COLUMNS.IN_PROGRESS);
    });

    it('should set completedAt when moving to DONE', () => {
        const store = useBoardStore.getState();
        const task = { title: 'Done Task', priority: PRIORITIES.LOW, estimate: 1, assignee: 'User' };
        store.addTask(COLUMNS.IN_PROGRESS, task);

        const now = 1000;
        vi.setSystemTime(now);

        store.moveTask(mockUUID, COLUMNS.IN_PROGRESS, COLUMNS.DONE, 0);

        const updatedState = useBoardStore.getState();
        expect(updatedState.columns[COLUMNS.DONE][0].completedAt).toBe(now);
    });

    it('should set blockedAt when moving to BLOCKED', () => {
        const store = useBoardStore.getState();
        const task = { title: 'Blocked Task', priority: PRIORITIES.LOW, estimate: 1, assignee: 'User' };
        store.addTask(COLUMNS.IN_PROGRESS, task);

        const now = 2000;
        vi.setSystemTime(now);

        store.moveTask(mockUUID, COLUMNS.IN_PROGRESS, COLUMNS.BLOCKED, 0);

        const updatedState = useBoardStore.getState();
        expect(updatedState.columns[COLUMNS.BLOCKED][0].blockedAt).toBe(now);
    });

    it('should remove blockedAt when moving out of BLOCKED', () => {
        const store = useBoardStore.getState();
        const task = { title: 'Unblocked Task', priority: PRIORITIES.LOW, estimate: 1, assignee: 'User' };
        store.addTask(COLUMNS.BLOCKED, task);

        const updatedState1 = useBoardStore.getState();
        expect(updatedState1.columns[COLUMNS.BLOCKED][0].blockedAt).toBeDefined();

        store.moveTask(mockUUID, COLUMNS.BLOCKED, COLUMNS.BACKLOG, 0);

        const updatedState2 = useBoardStore.getState();
        expect(updatedState2.columns[COLUMNS.BACKLOG][0].blockedAt).toBeUndefined();
    });

    it('should delete a task', () => {
        const store = useBoardStore.getState();
        const task = { title: 'Delete Me', priority: PRIORITIES.LOW, estimate: 1, assignee: 'User' };
        store.addTask(COLUMNS.BACKLOG, task);

        store.deleteTask(mockUUID, COLUMNS.BACKLOG);

        const updatedState = useBoardStore.getState();
        expect(updatedState.columns[COLUMNS.BACKLOG]).toHaveLength(0);
    });

    it('should update a task', () => {
        const store = useBoardStore.getState();
        const task = { title: 'Update Me', priority: PRIORITIES.LOW, estimate: 1, assignee: 'User' };
        store.addTask(COLUMNS.BACKLOG, task);

        const updates = { title: 'Updated Title' };
        store.updateTask(mockUUID, COLUMNS.BACKLOG, updates);

        const updatedState = useBoardStore.getState();
        expect(updatedState.columns[COLUMNS.BACKLOG][0].title).toBe('Updated Title');
    });

    it('should handle setEditingTask and clearEditingTask', () => {
        const store = useBoardStore.getState();
        store.setEditingTask('task-1', 'col-1');
        expect(useBoardStore.getState().editingTask).toEqual({ taskId: 'task-1', columnId: 'col-1' });

        store.clearEditingTask();
        expect(useBoardStore.getState().editingTask).toBeNull();
    });

    it('should update settings', () => {
        const store = useBoardStore.getState();
        store.updateSettings(20, 48);

        const updatedState = useBoardStore.getState();
        expect(updatedState.wipLimitHours).toBe(20);
        expect(updatedState.blockedStallTimeHours).toBe(48);
    });
});
