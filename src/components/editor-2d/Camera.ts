export class Camera {
  public x = 0;
  public y = 0;
  public scale = 1;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  // https://stackoverflow.com/a/68247894
  public toWorld(x: number, y: number) {  // convert to world coordinates
      x = (x - this.x) / this.scale;
      y = (y - this.y) / this.scale;
      return {x, y};
  }

  public toScreen(x: number, y: number) {
      x = x * this.scale + this.x;
      y = y * this.scale + this.y;
      return {x, y};
  }

  public scaleAt(x: number, y: number, scaleBy: number) {
    if (scaleBy < 1 && this.scale < 0.02) {
      return;
    }
    this.scale *= scaleBy;
    this.x = x - (x - this.x) * scaleBy;
    this.y = y - (y - this.y) * scaleBy;
  }

  public applyTransform() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.x, this.y);
  }

  public clearTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
