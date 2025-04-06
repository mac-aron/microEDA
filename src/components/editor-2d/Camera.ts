import { Vec2 } from './Vec2';

//Could instead have Transform class, and have camera = new Transform();
//  but wouldn't have the names toWorld and toScreen then
//or call it View?
export class Camera {
  public pos = new Vec2();
  public scale = 1;

  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) { }

  // https://stackoverflow.com/a/68247894
  public toWorld(pos: Vec2) {  // convert to world coordinates
    // Or implement as something like:
    //   pos.transform(this.transform.inverse());
    return pos.sub(this.pos).div(this.scale);
  }

  public toScreen(pos: Vec2) {  // convert to screen coordinates
    // Or implement as something like:
    //   pos.transform(this.transform);
    return pos.scale(this.scale).add(this.pos);
  }

  //TODO: Understand reason behind sub and scale order
  public zoomAt(at: Vec2, scaleBy: number) {
    if (scaleBy < 1 && this.scale < 0.02) {
      return;
    }
    this.scale *= scaleBy;
    this.pos = at.sub(at.sub(this.pos).scale(scaleBy));
  }

  public pan(delta: Vec2): void;
  public pan(x: number, y: number): void;
  public pan(arg1: Vec2 | number, arg2?: number) {
    if (arg1 instanceof Vec2) {
      this.pos = this.pos.add(arg1);
      return;
    }
    if (arg2 === undefined) {
      throw new Error("Invalid arguments");
    }
    this.pos = this.pos.add(new Vec2(arg1, arg2));
  }

  public applyTransform() {
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.pos.x, this.pos.y);
  }

  public clearTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
