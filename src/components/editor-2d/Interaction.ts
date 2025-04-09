import { Camera } from './Camera';
import { Vec2 } from './Util/Vec2';
import { Box2 } from './Util/Box2';
import { Selection } from './Selection';

export enum InteractionMode {
  NONE,
  SELECT,
  MOVE
};

// Manages user interaction with the canvas through mouse events
export class Interaction {
  //Cursor/button info - avoid using outside of this class
  public cursor = new Vec2();
  private presses = { left: false, right: false };
  private pressStart = {
    left: {
      screen: new Vec2(),
      world: new Vec2()
    },
    right: {
      screen: new Vec2(),
      world: new Vec2()
    }
  };

  public mode: InteractionMode = InteractionMode.NONE;

  constructor(private canvas: HTMLCanvasElement, private camera: Camera, private selection: Selection) {
    // Setup interaction event listeners
    canvas.addEventListener("mouseup", this.handleMouseUp);
    canvas.addEventListener("mousedown", this.handleMouseDown);
    canvas.addEventListener("mouseleave", this.handleMouseLeave);

    canvas.addEventListener("mousemove", this.handleMouseMove);

    canvas.addEventListener("wheel", this.handleWheel);
    canvas.addEventListener("auxclick", this.handleWheelClick);

    // Prevent default context menu on right-click
    canvas.addEventListener("contextmenu", event => event.preventDefault());

    // Capture pointer (continue dragging while outside of canvas)
    canvas.onpointerdown = (event) => {
      canvas.setPointerCapture(event.pointerId);
    }
  }

  private handleMouseUp = (event: MouseEvent) => {
    // Determine which button was released
    if (event.button === 0) { // Left button
      this.presses.left = false;

      switch (this.mode) {
        case InteractionMode.SELECT:
          this.selection.selectFromBox();
          this.mode = InteractionMode.NONE;
          break;

        case InteractionMode.MOVE:
          // TODO: Restore previous state if move invalid
          this.mode = InteractionMode.NONE;
          break;

        default:
          this.selection.deselect();
          this.selection.selectItemUnderPoint(this.camera.toWorld(this.cursor));
      }

    } else if (event.button === 2) { // Right button
      this.presses.right = false;
    }
  }

  private handleMouseDown = (event: MouseEvent) => {
    // Determine which button was pressed
    if (event.button === 0) { // Left button
      this.presses.left = true;
      this.pressStart.left.screen = this.cursor;
      this.pressStart.left.world = this.camera.toWorld(this.cursor);
    } else if (event.button === 2) { // Right button
      this.presses.right = true;
      this.pressStart.right.screen = this.cursor;
      this.pressStart.right.world = this.camera.toWorld(this.cursor);
    }
  }

  private handleMouseLeave = (_: MouseEvent) => {
    this.presses.left = false;
    this.presses.right = false;
    this.mode = InteractionMode.NONE;
  }

  private handleMouseMove = (event: MouseEvent) => {
    // Get position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1; //Factor in DPI

    let lastWorldCursor = this.camera.toWorld(this.cursor);

    this.cursor = new Vec2(
      (event.clientX - rect.left) * dpr,
      (event.clientY - rect.top) * dpr
    );

    if (this.mode == InteractionMode.NONE) {
      //Left clicked and mouse moved
      if (this.presses.left && this.cursor.distance(this.pressStart.left.screen) > 5) {

        if (this.selection.isSelectedItemUnderPoint(this.camera.toWorld(this.cursor))) {
          this.mode = InteractionMode.MOVE;
          lastWorldCursor = this.camera.toWorld(this.cursor);
        } else {
          this.mode = InteractionMode.SELECT;
        }
      }
    }

    if (this.mode == InteractionMode.SELECT) {
      this.selection.selectionBox = new Box2(
        this.pressStart.left.world,
        this.camera.toWorld(this.cursor)
      );
    }
    if (this.mode == InteractionMode.MOVE) {
      if (!this.presses.right) { //Quick fix to avoid moving while panning
        const delta = this.camera.toWorld(this.cursor).sub(lastWorldCursor);
        this.selection.selectedItems.moveItems(delta);
      }
    }

    //Panning the scene
    if (this.presses.right) {
      this.camera.pan(
        event.movementX * dpr,
        event.movementY * dpr
      );
    }
  }

  private handleWheel = (event: WheelEvent) => {
    // Prevent default scrolling behavior
    event.preventDefault();

    // Adjust zoom level based on wheel delta
    const zoomFactor = 1 + Math.abs(event.deltaY / 200);

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
}
