import { Draggable } from '@hello-pangea/dnd';
import { Clock, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { useBoardStore } from '../store/useBoardStore';
import { type Task, COLUMNS } from '../types/kanban';

interface Props {
    task: Task;
    index: number;
    columnId: string;
}

const TaskCard = ({ task, index, columnId }: Props) => {
    const deleteTask = useBoardStore((state) => state.deleteTask);

    // Requirement #3: Aging Logic (More than 24 hours in Blocked)
    const isStalled =
        columnId === COLUMNS.BLOCKED &&
        task.blockedAt &&
        (Date.now() - task.blockedAt) > 24 * 60 * 60 * 1000;

    const completionDate = task.completedAt
        ? new Date(task.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
        : null;

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`
            group p-4 mb-3 rounded-xl border bg-white shadow-sm transition-all duration-200
            ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500 z-50 rotate-1' : 'hover:border-blue-300'}
            ${isStalled ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}
          `}
                >
                    <div className="flex justify-between items-center mb-2">
                        <PriorityBadge priority={task.priority} />
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTask(task.id, columnId);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1 rounded-md hover:bg-red-50 "
                                title="Delete task"
                            >
                                <Trash2 size={14} />
                            </button>
                            <div className="flex items-center gap-1 text-gray-400 font-mono text-xs">
                                <Clock size={12} />
                                <span>{task.estimate}h</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-3 line-clamp-2">
                        {task.title}
                    </h3>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                                {task.assignee.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-medium">{task.assignee}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {completionDate && (
                                <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                                    <CheckCircle2 size={12} />
                                    {completionDate}
                                </div>
                            )}
                            {isStalled && (
                                <div className="flex items-center gap-1 text-red-600 animate-pulse">
                                    <AlertCircle size={14} />
                                    <span className="text-[10px] font-bold">STALLED</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

const PriorityBadge = ({ priority }: { priority: Task['priority'] }) => {
    const styles = {
        High: 'bg-red-100 text-red-700 border-red-200',
        Medium: 'bg-amber-100 text-amber-700 border-amber-200',
        Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };

    return (
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${styles[priority]}`}>
            {priority}
        </span>
    );
};

export default TaskCard;