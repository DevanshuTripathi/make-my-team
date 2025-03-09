import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

const initialTasks = {
  todo: [
    { id: "task-1", content: "Complete the report" },
    { id: "task-2", content: "Review PRs" },
  ],
  inProgress: [{ id: "task-3", content: "Work on Kanban Board" }],
  done: [{ id: "task-4", content: "Fix UI bugs" }],
};

export default function TaskManagement() {
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceColumn = [...tasks[source.droppableId]];
    const destColumn = [...tasks[destination.droppableId]];

    const [movedItem] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, movedItem);

    setTasks((prevTasks) => ({
      ...prevTasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(tasks).map(([columnId, columnTasks]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-200 p-4 rounded-lg shadow-md min-h-[300px]"
              >
                <h2 className="text-xl font-bold mb-4">{columnId.toUpperCase()}</h2>
                {columnTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-3 bg-white rounded-md shadow mb-2"
                      >
                        {task.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
