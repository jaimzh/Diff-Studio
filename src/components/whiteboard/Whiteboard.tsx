import { useState, useEffect } from "react";
import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw";

const LOCAL_STORAGE_KEY = "excalidraw-drawing";

export const Whiteboard = () => {
  const [initialData, setInitialData] = useState<any>(null);

 
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        setInitialData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to load drawing", e);
      }
    }
  }, []);

 
  const handleChange = (elements: any, appState: any, files: any) => {
    const content = serializeAsJSON(elements, appState, files, "local");
    localStorage.setItem(LOCAL_STORAGE_KEY, content);

    console.log(content)
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-border/50 bg-bg-light/30">
      <Excalidraw 
        theme="dark" 
        initialData={initialData}
        onChange={handleChange}
      />
    </div>
  );
};