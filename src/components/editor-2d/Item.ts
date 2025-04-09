import { Vec2 } from "./Util/Vec2";
import { Box2 } from "./Util/Box2";

//Item is something drawable in world space, has a position and a bounding box
//for selection

//Make abstract?
export class Item {
  public pos: Vec2; // The item's center
  private boundsUnrotated: Vec2;
  public rotation = 0; // Rotation in degrees

  public collides: boolean = false;

  // Path just for outline? Can't have text in path so...
  public path: Path2D | null = null;

  public img: HTMLImageElement | null = null;
  // private svg: SVGImageElement;

  //Bounds are for selection
  constructor(pos: Vec2, bounds: Vec2) {
    this.pos = pos;
    this.boundsUnrotated = bounds;
    this.bounds = bounds;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.rotation) ctx.rotate(this.rotation * Math.PI / 180);

    if (this.img) {
      // Image
      const imgPos = this.boundsUnrotated.div(2).scale(-1);

      try {
        ctx.drawImage(this.img, imgPos.x, imgPos.y, this.boundsUnrotated.x, this.boundsUnrotated.y);
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

    if (this.rotation) ctx.rotate(- this.rotation * Math.PI / 180);
  }

  public set bounds(value: Vec2) {
    this.boundsUnrotated = value;
  }

  // Rotate bounds before returning 
  public get bounds() {
    const unrotatedBox = Box2.fromCenterAndSize(this.pos, this.boundsUnrotated);
    const rotatedBox = unrotatedBox.rotate(this.rotation);
    return rotatedBox.size();
  }

  public get box() {
    return Box2.fromCenterAndSize(this.pos, this.bounds);
  }
}
