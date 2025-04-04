import { useState, useRef } from "react";
import { Button, Box } from "@mui/material";
import Canvas from "./Canvas";
import { CanvasRenderer } from "./CanvasRenderer";

function EditorCanvas() {
  const [isEditMode, setIsEditMode] = useState(false);
  const rendererRef = useRef<CanvasRenderer | null>(null);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <Button
        variant="contained"
        onClick={() => setIsEditMode(!isEditMode)}
        sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
      >
        {isEditMode ? "Preview Mode" : "Edit Mode"}
      </Button>

      <Canvas
        onUpdate={(canvas, ctx) => {
          if (!rendererRef.current) {
            rendererRef.current = new CanvasRenderer(canvas, ctx);
          }
          rendererRef.current.drawFrame();
        }}
      />
    </Box>
  );
}

export default EditorCanvas;
