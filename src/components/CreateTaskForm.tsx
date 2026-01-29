import { useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { COLUMNS, PRIORITIES, type Priority, type FormData } from '../types/kanban';

const CreateTaskForm = ({ onClose }: { onClose: () => void }) => {
    const addTask = useBoardStore((state) => state.addTask);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        assignee: '',
        estimate: 0,
        priority: PRIORITIES.LOW,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.assignee || formData.estimate <= 0) {
            alert("Please fill in all fields.");
            return;
        }
        const error = addTask(COLUMNS.BACKLOG, formData);

        if (error) {
            alert(error);
        } else {
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md border">
            <h2 className="text-lg font-bold">Create New Task</h2>

            <input
                className="w-full p-2 border rounded"
                placeholder="Task Title"
                autoFocus
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <div className="flex gap-2">
                <input
                    className="w-1/2 p-2 border rounded"
                    placeholder="Assignee Name"
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                />
                <input
                    type="number"
                    className="w-1/2 p-2 border rounded"
                    placeholder="Est. Hours"
                    onChange={(e) => setFormData({ ...formData, estimate: Number(e.target.value) })}
                />
            </div>

            <select
                className="w-full p-2 border rounded"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
            >
                <option value={PRIORITIES.LOW}>Low Priority</option>
                <option value={PRIORITIES.MEDIUM}>Medium Priority</option>
                <option value={PRIORITIES.HIGH}>High Priority</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create Task</button>
            </div>
        </form>
    );
};

export default CreateTaskForm;
