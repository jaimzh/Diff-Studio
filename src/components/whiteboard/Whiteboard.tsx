import { Excalidraw } from "@excalidraw/excalidraw";
export const Whiteboard = () => {
  return (
    <div className="h-full w-full overflow-hidden rounded-xl border border-border/50 bg-bg-light/30">
      <Excalidraw
      theme="dark"   
    
      />
    </div>
  );
};
