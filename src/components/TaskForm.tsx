import { useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { COLUMNS, PRIORITIES, type Priority, type FormData, type Task } from '../types/kanban';

const TaskForm = ({ onClose, selectedTask }: { onClose: () => void; selectedTask?: Task }) => {
    const { addTask, updateTask } = useBoardStore();

    const title = selectedTask ? 'Update Task' : 'Create Task'

    const [formData, setFormData] = useState<FormData>({
        title: selectedTask?.title || '',
        assignee: selectedTask?.assignee || '',
        estimate: selectedTask?.estimate || 0,
        priority: (selectedTask?.priority || PRIORITIES.LOW) as Priority,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.assignee || formData.estimate <= 0) {
            alert("Please fill in all fields.");
            return;
        }
        const error = selectedTask ?
            updateTask(selectedTask.id, selectedTask.columnId, formData) :
            addTask(COLUMNS.BACKLOG, formData);

        if (error) {
            alert(error);
        } else {
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md border">
            <h2 className="text-lg font-bold">{title}</h2>

            <input
                className="w-full p-2 border rounded"
                placeholder="Task Title"
                value={formData.title}
                autoFocus
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <div className="flex gap-2">
                <input
                    className="w-1/2 p-2 border rounded"
                    placeholder="Assignee Name"
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                />
                <input
                    type="number"
                    className="w-1/2 p-2 border rounded"
                    placeholder="Est. Hours"
                    value={formData.estimate}
                    onChange={(e) => setFormData({ ...formData, estimate: Number(e.target.value) })}
                />
            </div>

            <select
                className="w-full p-2 border rounded"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
            >
                <option value={PRIORITIES.LOW}>Low Priority</option>
                <option value={PRIORITIES.MEDIUM}>Medium Priority</option>
                <option value={PRIORITIES.HIGH}>High Priority</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">{title}</button>
            </div>
        </form>
    );
};

export default TaskForm;
