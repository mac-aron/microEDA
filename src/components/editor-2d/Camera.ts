import { Vec2 } from './Vec2';

//Could instead have Transform class, and have camera = new Transform();
//  but wouldn't have the names toWorld and toScreen then
//or call it View?
export class Camera {
  public pos = new Vec2();
  public scale = 1;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  // https://stackoverflow.com/a/68247894
  public toWorld(pos: Vec2) {  // convert to world coordinates
    // Or implement as something like:
    //   Vec2.transform(pos, this.transform.inverse());
    return Vec2.sub(pos, this.pos).div(this.scale);
  }

  public toScreen(pos: Vec2) {  // convert to screen coordinates
    // Or implement as something like:
    //   Vec2.transform(pos, this.transform);
    return Vec2.scale(pos, this.scale).add(this.pos);
  }

  public zoomAt(at: Vec2, scaleBy: number) {
    if (scaleBy < 1 && this.scale < 0.02) {
      return;
    }
    this.scale *= scaleBy;
    const d = Vec2.sub(at, this.pos).scale(scaleBy);
    this.pos = Vec2.sub(at, d);
  }

  public applyTransform() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.pos.x, this.pos.y);
  }

  public clearTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
