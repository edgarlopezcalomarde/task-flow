import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content?: string;
  title: string;
  createdAt: Date;
};

type State = {
  columns: Array<Column>;
  tasks: Array<Task>;
};

type Actions = {
  createNewColumn: () => void;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, req: { content?: string; title?: string }) => void;
  putColumns: (columns: Array<Column>) => void;
  putTasks: (tasks: Array<Task>) => void;
};

export const useKanbanStore = create(
  persist<State & Actions>(
    (set) => ({
      columns: [],
      tasks: [],
      createNewColumn: () =>
        set((state) => {
          return {
            columns: [
              ...state.columns,
              {
                id: crypto.randomUUID(),
                title: `Column ${state.columns.length}`,
              },
            ],
          };
        }),
      deleteColumn: (id: Id) =>
        set((state) => {
          const columns = state.columns.filter((c) => c.id !== id);
          const tasks = state.tasks.filter((t) => t.columnId !== id);

          return { columns, tasks };
        }),
      updateColumn: (id: Id, title: string) =>
        set((state) => {
          const newCols = state.columns.map((col) => {
            if (col.id !== id) return col;

            return { ...col, title };
          });

          return { columns: newCols };
        }),
      createTask: (columnId: Id) =>
        set((state) => {
          return {
            tasks: [
              ...state.tasks,
              {
                id: crypto.randomUUID(),
                columnId,
                title: `Task ${state.tasks.length}`,
                content: "",
                createdAt: new Date(),
              },
            ],
          };
        }),
      deleteTask: (id: Id) =>
        set((state) => {
          const filteredTasks = state.tasks.filter((t) => t.id !== id);
          return {
            tasks: filteredTasks,
          };
        }),
      updateTask: (id: Id, req: { content?: string; title?: string }) =>
        set((state) => {
          const mappedTasks = state.tasks.map((task) => {
            if (task.id !== id) return task;

            return { ...task, ...req };
          });

          return { tasks: mappedTasks };
        }),
      putColumns: (columns: Array<Column>) =>
        set(() => ({
          columns,
        })),
      putTasks: (tasks: Array<Task>) => set(() => ({ tasks }))
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
