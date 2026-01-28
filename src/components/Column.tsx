import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import type { Task } from '../types/kanban';

interface Props {
    id: string;
    tasks: Task[];
}

const Column = ({ id, tasks }: Props) => {
    const totalHours = tasks.reduce((sum, t) => sum + t.estimate, 0);
    console.log(tasks)

    return (
        <div className="w-80 flex flex-col bg-gray-200 rounded-lg p-3 min-h-[500px]">
            <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="font-bold text-gray-700 uppercase text-sm">{id}</h2>
                <span className="bg-gray-300 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">
                    {totalHours}h
                </span>
            </div>

            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 transition-colors rounded-md ${snapshot.isDraggingOver ? 'bg-gray-300' : ''
                            }`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} columnId={id} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;