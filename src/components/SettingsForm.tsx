import { useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';

const CreateTaskForm = ({ onClose }: { onClose: () => void }) => {
    const updateSettings = useBoardStore((state) => state.updateSettings);
    const wipLimitHours = useBoardStore((state) => state.wipLimitHours);
    const blockedStallTimeHours = useBoardStore((state) => state.blockedStallTimeHours);

    const [formData, setFormData] = useState({
        wipLimitHours,
        blockedStallTimeHours,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.wipLimitHours <= 0) {
            alert("WIP Limit must be greater than 0");
            return;
        }

        if (formData.blockedStallTimeHours <= 0) {
            alert("Blocked Stall Time must be greater than 0");
            return;
        }

        updateSettings(formData.wipLimitHours, formData.blockedStallTimeHours);
        onClose();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md border">
            <h2 className="text-lg font-bold">Board Settings</h2>

            <label className="block text-sm font-medium text-gray-700 mb-2">WIP Limit Hours</label>
            <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="WIP Limit Hours"
                value={formData.wipLimitHours}
                onChange={(e) => setFormData({ ...formData, wipLimitHours: Number(e.target.value) })}
            />

            <label className="block text-sm font-medium text-gray-700 mb-2">Blocked Stall Time Hours</label>
            <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="Blocked Stall Time Hours"
                value={formData.blockedStallTimeHours}
                onChange={(e) => setFormData({ ...formData, blockedStallTimeHours: Number(e.target.value) })}
            />

            <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">Update</button>
            </div>
        </form>
    );
};

export default CreateTaskForm;
