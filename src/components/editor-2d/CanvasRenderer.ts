import { Camera } from "./Camera";
import { Interaction } from "./Interaction";
import { Vec2 } from "./Vec2";

export class CanvasRenderer {
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
  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {
    this.camera = new Camera(canvas, ctx);
    this.interaction = new Interaction(canvas, this.camera);

    console.log(this)
  }

  /**
   * Draws an entire frame, clearing the canvas first.
   */
  public drawFrame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Scene has collection of layers
    // > Layer implements drawable
    // > Layer has a collection of objects
    // Draw layer (drawable?)
    // > Draw 

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

    let start = new Vec2(-gridSize);
    let end = new Vec2(this.canvas.width, this.canvas.height);

    start = start.add(this.camera.pos.mod(gridSize));

    for (let x = start.x; x < end.x; x += gridSize) {
      this.ctx.moveTo(x, start.y);
      this.ctx.lineTo(x, end.y);
    }
    for (let y = start.y; y < end.y; y += gridSize) {
      this.ctx.moveTo(start.x, y);
      this.ctx.lineTo(end.x, y);
    }
    this.ctx.stroke();
  }

  private drawText() {
    this.ctx.fillStyle = this.palette.gridText;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("Hi", 10, 10);

    this.camera.applyTransform();
    this.ctx.fillStyle = this.palette.gridLine;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("Hi Again", 10, 10);
    this.camera.clearTransform();
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
    const mousePos = this.interaction.cursor;
    this.ctx.fillRect(mousePos.x, mousePos.y, 100, 100);

    this.camera.applyTransform();
    const pos = this.camera.toWorld(mousePos);
    this.ctx.fillStyle = "#0000ff";
    this.ctx.fillRect(pos.x, pos.y, 100, 100);
    this.camera.clearTransform();
  }
}
