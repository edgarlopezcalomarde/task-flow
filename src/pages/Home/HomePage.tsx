import Button from "../../components/Button";
import { useKanbanStore } from "../../components/Kanban/state/kanban";
import Add from "../../lib/icons/Add";
import Board from "../../components/Kanban/Board";
import Upload from "../../lib/icons/Upload";

import { groupBy } from "../../lib/utils/fn";
import { Task } from "../../types";
import { createCSV } from "../../lib/utils/csv";
import { ChangeEvent, useRef } from "react";

function HomePage() {
  const { createNewColumn, columns, tasks } = useKanbanStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="h-[92vh] flex ">
      <div className="flex flex-col flex-grow w-[80vw]">
        {/* <div className="min-h-[5vh]  border-slate-300 border-b w-[80vw] flex justify-end p-1 gap-2"> */}
        <div className="min-h-[5vh]  border-slate-300 border-b  flex justify-center p-1 gap-2">
          <Button
            onClick={() => {
              createNewColumn();
            }}
          >
            <Add />
          </Button>

          <Button onClick={handleUpload}>
            <Upload />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const selectedFile = e.target.files && e.target.files[0];

                if (selectedFile) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    try {
                      const jsonString = JSON.parse(e.target?.result as string);
                      localStorage.setItem("task-storage", jsonString);
                      window.location.reload();
                    } catch (error) {
                      console.error("Error parsing JSON file:", error);
                    }
                  };
                  reader.readAsText(selectedFile);
                }
              }}
            />
          </Button>

          <Button onClick={() => handleDownloadJSON()}>JSON</Button>
          <Button onClick={() => handleDownloadCSV()}>CSV</Button>
        </div>
        <div className="overflow-x-auto overflow-y-hidden flex-grow flex bg-slate-200 p-4">
          <Board />
        </div>
      </div>
      {/* <Aside /> */}
    </section>
  );

  function handleDownloadCSV() {
    const csv = createCSV(
      columns.map((c) => c.title),
      Object.values(groupBy<Task>(tasks, "columnId")).map((a) =>
        a.map((t) => `${t.title} ${t.content}`)
      )
    );

    if (csv) {
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = crypto.randomUUID() + ".csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  function handleDownloadJSON() {
    const json = JSON.stringify(
      localStorage.getItem("task-storage") ?? { state: {} }
    );

    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = crypto.randomUUID() + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleUpload() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }
}

export default HomePage;
