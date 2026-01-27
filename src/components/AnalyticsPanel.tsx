import { useMemo } from "react";
import { useBoardStore } from "../store/useBoardStore";

const AnalyticsPanel = () => {
    const columns = useBoardStore((state) => state.columns);

    // Derived Values
    const statsByAssignee = useMemo(() => {
        const totals: Record<string, number> = {};
        Object.values(columns).flat().forEach(task => {
            totals[task.assignee] = (totals[task.assignee] || 0) + task.estimate;
        });
        return totals;
    }, [columns]);

    return (
        <div className="p-4 bg-white shadow rounded">
            <h3>Resource Load</h3>
            {Object.entries(statsByAssignee).map(([name, hours]) => (
                <p key={name}>{name}: {hours}h</p>
            ))}
        </div>
    );
};

export default AnalyticsPanel;