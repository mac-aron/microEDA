import React, { useRef, useState, useLayoutEffect } from "react";

interface CanvasProps {
  onCanvasReady?: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
}

const Canvas: React.FC<CanvasProps> = ({ onCanvasReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;

    if (!parent) return;

    // Ensure parent is styled to properly contain the canvas
    parent.style.position = "relative";
    parent.style.overflow = "hidden"; // Prevent unintended stretching

    const resizeObserver = new ResizeObserver(() => {
      setDimensions({
        width: parent.offsetWidth,
        height: parent.offsetHeight,
      });
    });

    resizeObserver.observe(parent);

    return () => resizeObserver.disconnect();
  }, []);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
    }

    if (onCanvasReady && ctx) {
      onCanvasReady(canvas, ctx);
    }
  }, [dimensions, onCanvasReady]);

  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />;
};

export default Canvas;
