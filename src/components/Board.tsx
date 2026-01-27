import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useBoardStore } from '../store/useBoardStore';
import Column from './Column';

import { type ColumnId } from '../types/kanban';

const Board = () => {
    const { columns, moveTask } = useBoardStore();

    const onDragEnd = (result: DropResult) => {
        const { draggableId, source, destination } = result;

        if (!destination || (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        )) return;

        const error = moveTask(
            draggableId,
            source.droppableId,
            destination.droppableId,
            destination.index
        );

        if (error) {
            alert(error);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 p-6 overflow-x-auto h-full bg-boardBg">
                {Object.keys(columns).map((columnId) => (
                    <Column
                        key={columnId}
                        id={columnId}
                        tasks={columns[columnId as ColumnId]}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};

export default Board;
