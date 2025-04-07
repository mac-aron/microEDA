import React, { useRef, useState, useLayoutEffect } from "react";

interface CanvasProps {
  onUpdate?: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, time: number) => void;
}

const CanvasFullscreen: React.FC<CanvasProps> = ({ onUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  /**
   * Effect to handle resizing when the window changes size.
   */
  useLayoutEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Effect to handle setting up the canvas and updating it continuously via requestAnimationFrame.
   */
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas) {
      const dpr = window.devicePixelRatio || 1;

      // Ensure canvas covers the full screen
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.zIndex = "9999"; // Ensure it's above everything
      canvas.style.backgroundColor = "white";

      canvas.width = dimensions.width * dpr;
      canvas.height = dimensions.height * dpr;
      ctx?.scale(dpr, dpr);
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

  // Render the canvas element
  return <canvas ref={canvasRef} />;
};

export default CanvasFullscreen;
