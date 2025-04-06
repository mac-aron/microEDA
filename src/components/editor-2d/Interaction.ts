import { Camera } from './Camera';

//Enum for modes
enum InteractionMode {
  NONE,
  PAN,
  SELECT
};

export class Interaction {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;

  public cursor = { x: 0, y: 0, left: false, right: false };
  public mode: InteractionMode = InteractionMode.NONE;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, camera: Camera) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.camera = camera;

    // Setup interaction event listeners
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseleave", this.handleMouseLeave);

    this.canvas.addEventListener("mousemove", this.handleMouseMove);

    this.canvas.addEventListener("wheel", this.handleWheel);
    this.canvas.addEventListener("auxclick", this.handleWheelClick);

    // Prevent default context menu on right-click
    this.canvas.addEventListener("contextmenu", event => event.preventDefault());
  }


  private handleMouseUp = (event: MouseEvent) => {
    // Determine which button was released
    if (event.button === 0) { // Left button
      this.cursor.left = false;
    } else if (event.button === 2) { // Right button
      this.cursor.right = false;
      if (this.mode == InteractionMode.PAN) {
        this.mode = InteractionMode.NONE;
      }
    }
  }

  private handleMouseDown = (event: MouseEvent) => {
    // Determine which button was pressed
    if (event.button === 0) { // Left button
      this.cursor.left = true;
    } else if (event.button === 2) { // Right button
      this.cursor.right = true;
    }
  }

  private handleMouseLeave = (event: MouseEvent) => {
    this.cursor.left = false;
    this.cursor.right = false;
    this.mode = InteractionMode.NONE;
  }

  private handleMouseMove = (event: MouseEvent) => {
    // Get position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1; //Factor in DPI

    this.cursor.x = (event.clientX - rect.left) * dpr;
    this.cursor.y = (event.clientY - rect.top) * dpr;

    //Dragging the scene
    if (this.cursor.right) {
      this.mode = InteractionMode.PAN;
    }

    if (this.mode == InteractionMode.PAN) {
      this.camera.x += event.movementX;
      this.camera.y += event.movementY;
    }
  }

  private handleWheel = (event: WheelEvent) => {
    // Prevent default scrolling behavior
    event.preventDefault();

    // Adjust zoom level based on wheel delta
    const zoomFactor = 1.1;

    if (event.deltaY < 0) {
      this.camera.zoomAt(this.cursor.x, this.cursor.y, zoomFactor);
    } else {
      this.camera.zoomAt(this.cursor.x, this.cursor.y, 1 / zoomFactor);
    }
  }

  private handleWheelClick = (event: MouseEvent) => {
    if (event.button === 1) { // Middle button (wheel click)
      event.preventDefault();
      this.camera.x = 0;
      this.camera.y = 0;
      this.camera.scale = 1;
    }
  }
}
