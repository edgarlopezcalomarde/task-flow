import Button from "../../../components/Button";
import { useKanbanStore } from "../../../components/Kanban/state/kanban";

function Aside() {
  const { columns } = useKanbanStore();

  return (
    <aside className="border-l w-[20vw] h-full min-w-[20vw] border-slate-300 overflow-y-auto flex flex-col">
      <h2 className="text-2xl font-semibold h-[49px] border-b flex items-center pl-2"> Custom Task</h2>

      <form className="p-4 flex flex-col gap-4  h-full">
        <label className="flex flex-col gap-2 text-sm font-semibold">
          Name:
          <input
            type="text"
            id="name"
            name="name"
            className="border border-slate-300 rounded bg-slate-200 px-4 py-2 outline-none text-sm font-normal"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold">
          Description:
          <textarea
            id="description"
            name="description"
            className="border border-slate-300 rounded bg-slate-200 px-4 py-2 outline-none text-sm font-normal"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold">
          Column:
          <select
            name="column"
            id="column"
            className="border border-slate-300 rounded bg-slate-200 px-4 py-2 outline-none text-sm font-normal"
          >
            {columns.map((c) => {
              return (
                <option
                  key={c.id}
                  className="border border-slate-300 bg-slate-200 py-4 outline-none text-sm font-normal"
                  value={c.id}
                >
                  {c.title}
                </option>
              );
            })}
          </select>
        </label>

        <div className="mt-auto"></div>

        <Button type="submit">Add</Button>
      </form>
    </aside>
  );
}

export default Aside;
