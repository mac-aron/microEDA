import { Vec2 } from "./Vec2";
import { Item } from "./Item";
import { Camera } from "./Camera";

export class ItemCollection {
  public pos = new Vec2();
  public collection: Item[] = [];

  constructor(private camera: Camera) { }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw with collection pos as origin
    ctx.translate(this.pos.x, this.pos.y);
    for (const object of this.collection) {
      // Optimization (Frustum Culling) 
      // Skip if no part of the item is in the viewport
      if (!this.camera.inViewport(object.pos, object.bounds)) continue;

      // Draw with object pos as origin
      ctx.translate(object.pos.x, object.pos.y);
      object.draw(ctx);
      ctx.translate(-object.pos.x, -object.pos.y);
    }
    ctx.translate(-this.pos.x, -this.pos.y);
  }

  public add(item: Item) {
    this.collection.push(item);
  }
}
