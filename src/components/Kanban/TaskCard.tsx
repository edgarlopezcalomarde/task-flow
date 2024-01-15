import { useState } from "react";
import { Id, Task } from "../../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TrashX from "../../lib/icons/TrashX";
import Check from "../../lib/icons/Check";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, req: { content?: string; title?: string }) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((m) => !m);
    setMouseIsOver(false);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
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
        className="bg-blue-200 border-blue-500 border p-2.5 h-[100px] min-h-[100px] items-center flex justify-between text-left rounded-xl cursor-grab text-white"
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-[#fdfdfd]  border border-slate-400 p-2.5  min-h-[100px] items-center flex flex-col justify-between text-left rounded-xl cursor-grab text-black"
      >
        <div className="flex gap-2 w-full h-full">
          <div className="flex flex-col h-full w-full gap-[2px]">
            <input
              type="text"
              className="text-black border w-full outline-none text-sm"
              value={task.title}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.shiftKey) {
                  toggleEditMode();
                }
              }}
              onChange={(e) => updateTask(task.id, { title: e.target.value })}
            />

            <textarea
              className="text-black border w-full outline-none text-sm h-full"
              value={task.content}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.shiftKey) {
                  toggleEditMode();
                }
              }}
              onChange={(e) => updateTask(task.id, { content: e.target.value })}
            />
          </div>
          <button onClick={toggleEditMode} className="mt-auto">
            <Check />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-[#fdfdfd]  border border-slate-400 p-2.5 h-[100px] min-h-[100px] items-center flex justify-between text-left rounded-xl cursor-grab text-black"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      onClick={() => toggleEditMode()}
    >
      <div className="flex flex-col h-full max-w-full justify-center">
        {task.content === "" ? (
          <p className="text-xl font-semibold">{task.title}</p>
        ) : (
          <p className="text-sm font-semibold text-wrap ">{task.title}</p>
        )}
        {task.content !== "" && (
          <p className="flex-grow text-sm overflow-hidden whitespace-no-wrap overflow-ellipsis">
            {task.content}
          </p>
        )}
      </div>

      {mouseIsOver && (
        <button onClick={() => deleteTask(task.id)} className="text-blue-600 mb-auto">
          <TrashX />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
