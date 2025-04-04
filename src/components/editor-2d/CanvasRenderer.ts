export class CanvasRenderer {
  // Canvas and its rendering context
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Camera position and zoom level
  private camera = {x: 0, y: 0, scale: 1};
  private cursor = {x: 0, y: 0, left: false, right: false};

  private mm = a => 5*a; // millimeter unit

  // Color palette used for drawing elements
  private palette = {
    background: "#ffffff",
    grid: "#ffffff",
    gridLine: "#cccccc",
    gridText: "#000000",
  };

  /**
   * Constructor initializes the renderer with a canvas and context.
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
   * @param {CanvasRenderingContext2D} ctx - The 2D context for rendering.
   */
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;

    // Setup interaction event listeners
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mouseleave", this.handleMouseLeave);
    this.canvas.addEventListener("wheel", this.handleMouseWheel);
    this.canvas.addEventListener("contextmenu", this.handleRightClick);

    console.log(this)
  }

  /**
   * Draws an entire frame, clearing the canvas first.
   */
  public drawFrame() {
    this.clearCanvas();
    this.drawGrid();
    this.drawBox();
    this.debugCursor();
    this.drawText();
  }

  private clearCanvas() {
    this.ctx.fillStyle = this.palette.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawGrid() {
    this.ctx.strokeStyle = this.palette.gridLine;
    this.ctx.lineWidth = 1;

    const gridSize = this.mm(10) * this.camera.scale;

    this.ctx.beginPath();
    const startPos = {x: -gridSize, y: -gridSize};
    const endPos = {x: this.canvas.width, y: this.canvas.height};

    startPos.x += this.camera.x % gridSize;
    startPos.y += this.camera.y % gridSize;

    for (let x = startPos.x; x < endPos.x; x += gridSize) {
      this.ctx.moveTo(x, startPos.y);
      this.ctx.lineTo(x, endPos.y);
    }
    for (let y = startPos.y; y < endPos.y; y += gridSize) {
      this.ctx.moveTo(startPos.x, y);
      this.ctx.lineTo(endPos.x,   y);
    }
    this.ctx.stroke();
  }

  private drawText() {
    this.ctx.fillStyle = this.palette.gridText;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("Hi", 10, 10);
  }

  private drawBox() {
    this.applyCamera();
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, 100, 100);
    this.ctx.fillRect(200, 200, 100, 100);
    this.clearCamera();
  }

  private debugCursor() {
    this.ctx.fillStyle = "#ff0000";
    this.ctx.fillRect(this.cursor.x, this.cursor.y, 100, 100);

    this.applyCamera();
    const pos = this.toWorld(this.cursor.x, this.cursor.y);
    this.ctx.fillStyle = "#0000ff";
    this.ctx.fillRect(pos.x, pos.y, 100, 100);
    this.clearCamera();
  }

  private applyCamera() {
    this.ctx.setTransform(this.camera.scale, 0, 0, this.camera.scale, this.camera.x, this.camera.y);
  }

  private clearCamera() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  private scaleAt(x, y, scaleBy) {
    if (scaleBy < 1 && this.camera.scale < 0.02) {
      return;
    }
    this.camera.scale *= scaleBy;
    this.camera.x = x - (x - this.camera.x) * scaleBy;
    this.camera.y = y - (y - this.camera.y) * scaleBy;
  }

  private handleMouseDown = (event: MouseEvent) => {
    // Determine which button was pressed
    if (event.button === 0) { // Left button
      this.cursor.left = true;
    } else if (event.button === 2) { // Right button
      this.cursor.right = true;
    }
  }

  private handleMouseUp = (event: MouseEvent) => {
    // Determine which button was released
    if (event.button === 0) { // Left button
      this.cursor.left = false;
    } else if (event.button === 2) { // Right button
      this.cursor.right = false;
    }
  }

  private handleMouseMove = (event: MouseEvent) => {
    // Get position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    this.cursor.x = event.clientX - rect.left;
    this.cursor.y = event.clientY - rect.top;

    //Dragging the scene
    if (this.cursor.right) {
      this.camera.x += event.movementX ;
      this.camera.y += event.movementY;
    }
  }

  private handleMouseWheel = (event: WheelEvent) => {
    // Prevent default scrolling behavior
    event.preventDefault();
    
    // Adjust zoom level based on wheel delta
    const zoomFactor = 1.1;

    if (event.deltaY < 0) {
      this.scaleAt(this.cursor.x, this.cursor.y, zoomFactor);
    } else {
      this.scaleAt(this.cursor.x, this.cursor.y, 1 / zoomFactor);
    }
  }

  private handleMouseLeave = (event: MouseEvent) => {
    this.cursor.left = false;
    this.cursor.right = false;
  }

  private handleRightClick = (event: MouseEvent) => {
    event.preventDefault();
  }

  // https://stackoverflow.com/a/68247894
  private toWorld(x, y) {  // convert to world coordinates
      x = (x - this.camera.x) / this.camera.scale;
      y = (y - this.camera.y) / this.camera.scale;
      return {x, y};
  }

  private toScreen(x, y) {
      x = x * this.camera.scale + this.camera.x;
      y = y * this.camera.scale + this.camera.y;
      return {x, y};
  }
}
