import { Vec2 } from './Vec2';

export class Camera {
  public pos = new Vec2();
  public scale = 1;

  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) { }

  // World space
  // ||=============||
  // ||x-w/2,y-h/2  ||
  // ||  scale: mm  ||
  // ||  x+w/2,y+h/2||
  // ||=============||
  public toWorld(pos: Vec2) {  // Screen to world coordinates
    // Or implement as something like:
    //   pos.transform(this.transform.inverse());
    return pos.sub(this.pos)
      .div(this.scale)
      .sub(this.viewportHalf());
  }

  // Screen space
  // ||============||
  // ||0,0         ||
  // || scale: px  ||
  // ||         w,h||
  // ||============||
  public toScreen(pos: Vec2) {  // World to screen coordinates
    // Or implement as something like:
    //   pos.transform(this.transform);
    return pos.add(this.viewportHalf())
      .scale(this.scale)
      .add(this.pos);
  }

  public viewport(): Vec2 {
    return new Vec2(this.canvas.width, this.canvas.height);
  }

  public viewportHalf(): Vec2 {
    return new Vec2(this.canvas.width / 2, this.canvas.height / 2);
  }

  //Is world space pos in screen space viewport? For frustum culling
  //bounds: check if the bounds rectangle is in the viewport
  public inViewport(pos: Vec2): boolean;
  public inViewport(pos: Vec2, bounds?: Vec2): boolean {
    if (bounds === undefined) {
      bounds = new Vec2(0);
    }
    const screenPosMin = this.toScreen(pos.add(bounds.div(2)));
    const screenPosMax = this.toScreen(pos.sub(bounds.div(2)));
    const viewport = this.viewport();
    return (
      screenPosMin.x >= 0 &&
      screenPosMin.y >= 0 &&
      screenPosMax.x <= viewport.x &&
      screenPosMax.y <= viewport.y
    );
  }

  //TODO: Understand reason behind sub and scale order
  public zoomAt(at: Vec2, scaleBy: number) {
    if (scaleBy < 1 && this.scale < 0.04) return;
    if (scaleBy > 1 && this.scale > 2000) return;

    this.scale *= scaleBy;
    const delta = at.sub(this.pos).scale(scaleBy);
    this.pos = at.sub(delta);
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
    this.ctx.translate(this.viewportHalf().x, this.viewportHalf().y);
  }

  public clearTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
