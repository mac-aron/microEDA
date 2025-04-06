import { Camera } from './Camera';
import { Vec2 } from './Vec2';

//Enum for modes
enum InteractionMode {
  NONE,
  PAN,
  SELECT
};

export class Interaction {
  private canvas: HTMLCanvasElement;
  private camera: Camera;

  //Cursor/button info
  private cursor = new Vec2();
  private presses = { left: false, right: false };

  public mode: InteractionMode = InteractionMode.NONE;

  constructor(canvas: HTMLCanvasElement, camera: Camera) {
    this.canvas = canvas;
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
      this.presses.left = false;
    } else if (event.button === 2) { // Right button
      this.presses.right = false;
      if (this.mode == InteractionMode.PAN) {
        this.mode = InteractionMode.NONE;
      }
    }
  }

  private handleMouseDown = (event: MouseEvent) => {
    // Determine which button was pressed
    if (event.button === 0) { // Left button
      this.presses.left = true;
    } else if (event.button === 2) { // Right button
      this.presses.right = true;
    }
  }

  private handleMouseLeave = (event: MouseEvent) => {
    this.presses.left = false;
    this.presses.right = false;
    this.mode = InteractionMode.NONE;
  }

  private handleMouseMove = (event: MouseEvent) => {
    // Get position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1; //Factor in DPI

    this.cursor = new Vec2(
      (event.clientX - rect.left) * dpr,
      (event.clientY - rect.top) * dpr
    );

    //Dragging the scene
    if (this.presses.right) {
      this.mode = InteractionMode.PAN;
    }

    if (this.mode == InteractionMode.PAN) {
      this.camera.pos.add(event.movementX, event.movementY);
    }
  }

  private handleWheel = (event: WheelEvent) => {
    // Prevent default scrolling behavior
    event.preventDefault();

    // Adjust zoom level based on wheel delta
    const zoomFactor = 1.1;

    if (event.deltaY < 0) {
      this.camera.zoomAt(this.cursor, zoomFactor);
    } else {
      this.camera.zoomAt(this.cursor, 1 / zoomFactor);
    }
  }

  private handleWheelClick = (event: MouseEvent) => {
    if (event.button === 1) { // Middle button (wheel click)
      event.preventDefault();
      this.camera.pos = new Vec2();
      this.camera.scale = 1;
    }
  }

  public getCursorPos(): Vec2 {
    return new Vec2(this.cursor);
  }
}
