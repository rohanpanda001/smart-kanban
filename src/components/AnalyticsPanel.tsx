import { useMemo } from "react";
import { useBoardStore } from "../store/useBoardStore";

const AnalyticsPanel = () => {
    const columns = useBoardStore((state) => state.columns);

    const statsByAssignee = useMemo(() => {
        const totals: Record<string, number> = {};
        Object.values(columns).flat().forEach(task => {
            totals[task.assignee] = (totals[task.assignee] || 0) + task.estimate;
        });
        return totals;
    }, [columns]);

    const statsByPriority = useMemo(() => {
        const totals: Record<string, number> = {};
        Object.values(columns).flat().forEach(task => {
            totals[task.priority] = (totals[task.priority] || 0) + task.estimate;
        });
        return totals;
    }, [columns]);

    return (
        <div className="p-4 bg-white shadow rounded">
            <h2 className="font-bold text-gray-700 uppercase text-m">Analytics Panel</h2>
            <h3 className="font-bold text-gray-700 uppercase text-sm mt-4 mb-2">Resource Load</h3>
            {Object.entries(statsByAssignee).map(([name, hours]) => (
                <p key={name} className="text-sm text-gray-600 mb-1">{name}: {hours}h</p>
            ))}
            <h3 className="font-bold text-gray-700 uppercase text-sm mt-4 mb-2">Priority Load</h3>
            {Object.entries(statsByPriority).map(([name, hours]) => (
                <p key={name} className="text-sm text-gray-600 mb-1">{name}: {hours}h</p>
            ))}
        </div>
    );
};

export default AnalyticsPanel;