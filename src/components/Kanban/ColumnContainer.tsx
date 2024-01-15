import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "../../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";
import Trash from "../../lib/icons/Trash";
import CirclePlus from "../../lib/icons/CirclePlus";

interface Props {
  column: Column;
  tasks: Array<Task>;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, req: {content?: string, title?:string}) => void;
}

function ColumnContainer(props: Props) {
  const {
    column,
    tasks,
    createTask,
    deleteTask,
    updateColumn,
    updateTask,
    deleteColumn,
  } = props;


  const [editMode, setEditMode] = useState(false);
  const taskIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-blue-200 border-blue-500 border rounded-md w-[300px]"
      />
    );
  }

  return (
    <div
      className="bg-slate-300 w-[300px] min-h-full rounded-lg flex flex-col"
      ref={setNodeRef}
      style={style}
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-blue-500 h-[50px] min-h-[50px] rounded-b-none text-md font-bold flex items-center gap-2 cursor-grab px-2 rounded-t-lg text-white"
      >
        <div className="bg-blue-700  h-[20px] w-[20px] text-sm font-medium rounded-full flex justify-center items-center text-white">
          {tasks.filter((t) => t.columnId === column.id).length}
        </div>
        {!editMode && column.title}
        {editMode && (
          <input
            type="text"
            value={column.title}
            onChange={(e) => updateColumn(column.id, e.target.value)}
            className="bg-transparent text-white outline-none"
            autoFocus
            onBlur={() => setEditMode(false)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditMode(false);
            }}
          />
        )}

        <button className="ml-auto" onClick={() => deleteColumn(column.id)}>
          <Trash />
        </button>
      </div>
      <div className="flex flex-grow gap-2 flex-col p-2 overflow-x-hidden overflow-y-auto ">
        <SortableContext items={taskIds}>
          {tasks.map((t) => {
            return (
              <TaskCard
                key={t.id}
                task={t}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            );
          })}
        </SortableContext>
      </div>
      <div className="flex gap-2 bg-blue-600 p-3 rounded-b-lg  justify-end text-white">
        <button onClick={() => createTask(column.id)}>
          <CirclePlus />
        </button>
      </div>
    </div>
  );
}

export default ColumnContainer;
