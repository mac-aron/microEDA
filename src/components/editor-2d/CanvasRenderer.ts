import { Camera } from "./Camera";
import { Interaction } from "./Interaction";

export class CanvasRenderer {
  // Canvas and its rendering context
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private camera: Camera;
  private interaction: Interaction;

  // Conversion from pixels to millimeters
  private mm = a => 5 * a;

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

    this.camera = new Camera(canvas, ctx);
    this.interaction = new Interaction(canvas, ctx, this.camera);

    console.log(this)
  }

  /**
   * Draws an entire frame, clearing the canvas first.
   */
  public drawFrame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGrid();
    this.drawBox();
    this.debugCursor();
    this.drawText();
  }

  private drawGrid() {
    this.ctx.strokeStyle = this.palette.gridLine;
    this.ctx.lineWidth = 1;

    const gridSize = this.mm(10) * this.camera.scale;

    this.ctx.beginPath();

    const startPos = { x: -gridSize, y: -gridSize };
    const endPos = { x: this.canvas.width, y: this.canvas.height };

    startPos.x += this.camera.x % gridSize;
    startPos.y += this.camera.y % gridSize;

    for (let x = startPos.x; x < endPos.x; x += gridSize) {
      this.ctx.moveTo(x, startPos.y);
      this.ctx.lineTo(x, endPos.y);
    }
    for (let y = startPos.y; y < endPos.y; y += gridSize) {
      this.ctx.moveTo(startPos.x, y);
      this.ctx.lineTo(endPos.x, y);
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
    this.camera.applyTransform();
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, 100, 100);
    this.ctx.fillRect(200, 200, 100, 100);
    this.camera.clearTransform();
  }

  private debugCursor() {
    this.ctx.fillStyle = "#ff0000";
    this.ctx.fillRect(this.interaction.cursor.x, this.interaction.cursor.y, 100, 100);

    this.camera.applyTransform();
    const pos = this.camera.toWorld(this.interaction.cursor.x, this.interaction.cursor.y);
    this.ctx.fillStyle = "#0000ff";
    this.ctx.fillRect(pos.x, pos.y, 100, 100);
    this.camera.clearTransform();
  }
}
