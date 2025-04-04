// EditorCanvas.tsx
import { Suspense, useRef, useEffect, useState } from "react";
import { Button, Box } from '@mui/material';
import Canvas from "./Canvas";

function EditorCanvas() {
  const [isEditMode, setIsEditMode] = useState(false);

  const pallette = {
    background: "#ffffff",
    grid: "#ffffff",
    gridLine: "#cccccc",
    gridText: "#000000",
  };

  const handleCanvasReady = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Handle canvas ready state
    ctx.fillStyle = pallette.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = pallette.gridText;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Edit Mode: " + (isEditMode ? "ON" : "OFF"), 0, 0);

    //Grid demo
    ctx.strokeStyle = pallette.gridLine;
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Button 
        variant="contained"
        onClick={() => setIsEditMode(!isEditMode)}
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 1 
        }}
      >
        {isEditMode ? 'Preview Mode' : 'Edit Mode'}
      </Button>

      <Canvas onCanvasReady={handleCanvasReady} />
    </Box>
  );
}

export default EditorCanvas;
