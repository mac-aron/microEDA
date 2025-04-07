import { Vec2 } from "./Vec2";

/*
Item is something drawable in world space, has a position.

May belong to an ItemCollection inside a Group, Layer or Scene

May have a bounding box (for selection and frustum culling)
// And a keepout box (for collision)?

Otherwise it's selectable by ctx.isPointInPath()
(ensure drawing is done via path, rect instead of fillRect)

The item is drawn with pos at the center
*/

//abstract?
export class Item {
  public pos: Vec2;
  public bounds: Vec2;

  // Path just for outline? Can't have text in path so...
  public path: Path2D | null = null;

  public img: HTMLImageElement | null = null;
  // private svg: SVGImageElement;

  //Bounds are for selection
  constructor(pos: Vec2, bounds: Vec2) {
    this.pos = pos;
    this.bounds = bounds;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.img) {
      // Image
      const imgPos = this.bounds.div(2).scale(-1);

      try {
        ctx.drawImage(this.img, imgPos.x, imgPos.y, this.bounds.x, this.bounds.y);
      } catch (e) {
        console.error("Error drawing image:", e);
      }
    } else if (this.path) {
      // Path
      ctx.strokeStyle = "#372";
      ctx.lineWidth = 5;
      ctx.fill(this.path);
      ctx.stroke(this.path);
    } else {
      // Placeholder
      ctx.beginPath();
      ctx.strokeStyle = "#372";
      ctx.lineWidth = 5;
      ctx.arc(0, 0, this.bounds.x / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // abstract contains(pos: Vec2): boolean;

  // abstract getBoundingBox(): { pos: Vec2; size: Vec2 };
}
