import React, { useRef, useState, useLayoutEffect } from "react";

interface CanvasProps {
  onUpdate?: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, time: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({ onUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  /**
   * Effect to handle resizing when the parent container changes size.
   * Uses ResizeObserver to detect size changes efficiently.
   */
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;

    if (!parent) return;

    // Ensure parent container is constrained correctly
    parent.style.position = "relative";
    parent.style.overflow = "hidden";
    parent.style.height = "100%"; // Explicitly define height to prevent layout issues

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = parent.getBoundingClientRect(); // More reliable than clientWidth/clientHeight
      setDimensions({ width, height });
    });

    resizeObserver.observe(parent);

    return () => resizeObserver.disconnect();
  }, []);

  /**
   * Effect to handle setting up the canvas and updating it continuously via requestAnimationFrame.
   */
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas) {
      const dpr = window.devicePixelRatio || 1;

      // Ensure canvas size updates properly (shrinks and grows)
      if (canvas.width !== dimensions.width * dpr || canvas.height !== dimensions.height * dpr) {
        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        canvas.style.width = `${dimensions.width}px`;
        canvas.style.height = `${dimensions.height}px`;

        // Prevent canvas from expanding beyond its parent container
        canvas.style.maxWidth = "100%";
        canvas.style.maxHeight = "100%";

        ctx?.scale(dpr, dpr); // Apply high-DPI scaling
      }
    }

    // Start animation loop
    if (onUpdate && ctx) {
      let animationFrameId: number;

      const updateCanvas = (time: number) => {
        onUpdate(canvas, ctx, time); // Call update function
        animationFrameId = requestAnimationFrame(updateCanvas); // Request next frame
      };

      animationFrameId = requestAnimationFrame(updateCanvas);

      return () => cancelAnimationFrame(animationFrameId); // Cleanup animation loop on unmount
    }
  }, [dimensions, onUpdate]);

  // Render the canvas element with proper styling
  return <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />;
};

export default Canvas;
