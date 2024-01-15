import { useMemo, useState } from "react";
import { Column, Task } from "../../types";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import { useKanbanStore } from "./state/kanban";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";

function Board() {
  const {
    columns,
    tasks,
    deleteTask,
    putColumns,
    putTasks,
    updateTask,
    createTask,
    deleteColumn,
    updateColumn,
  } = useKanbanStore();

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      sensors={sensors}
    >
      <div className="text-white flex gap-2 ">
        <SortableContext items={columnsId}>
          {columns.map((clm) => {
            return (
              <ColumnContainer
                createTask={createTask}
                deleteColumn={deleteColumn}
                deleteTask={deleteTask}
                updateColumn={updateColumn}
                updateTask={updateTask}
                key={clm.id}
                column={clm}
                tasks={tasks.filter((t) => t.columnId === clm.id)}
              />
            );
          })}
        </SortableContext>
      </div>

      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
              createTask={createTask}
              deleteColumn={deleteColumn}
              deleteTask={deleteTask}
              updateColumn={updateColumn}
              updateTask={updateTask}
              column={activeColumn}
              tasks={tasks.filter((t) => t.columnId === activeColumn.id)}
            />
          )}

          {activeTask && (
            <TaskCard
              task={activeTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }
  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const overColumnId = over.id;
    const activeColumnId = active.id;

    if (activeColumnId === overColumnId) return;

    const indexActiveCol = columns.findIndex((c) => c.id === activeColumnId);
    const indexOverCol = columns.findIndex((c) => c.id === overColumnId);

    putColumns(arrayMove(columns, indexActiveCol, indexOverCol));
  }
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const overId = over.id;
    const activeId = active.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (isActiveATask && isOverATask) {
      const activeIndx = tasks.findIndex((tsk) => tsk.id == activeId);
      const overIndx = tasks.findIndex((tsk) => tsk.id == overId);

      tasks[activeIndx].columnId = tasks[overIndx].columnId;
      putTasks(arrayMove(tasks, activeIndx, overIndx));
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      const activeIndx = tasks.findIndex((tsk) => tsk.id == activeId);
      const overIndx = tasks.findIndex((tsk) => tsk.id == overId);

      tasks[activeIndx].columnId = overId;

      putTasks(arrayMove(tasks, activeIndx, overIndx));
    }
  }
}

export default Board;
