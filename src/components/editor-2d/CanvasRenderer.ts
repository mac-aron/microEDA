export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private palette = {
    background: "#ffffff",
    grid: "#ffffff",
    gridLine: "#cccccc",
    gridText: "#000000",
  };

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  public drawFrame() {
    this.clearCanvas();
    this.drawGrid();
    this.drawText();
  }

  private clearCanvas() {
    this.ctx.fillStyle = this.palette.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawGrid() {
    this.ctx.strokeStyle = this.palette.gridLine;
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  private drawText() {
    this.ctx.fillStyle = this.palette.gridText;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("Hi", 10, 10);
  }
}
