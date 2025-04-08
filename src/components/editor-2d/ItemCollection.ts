import { Item } from "./Item";
import { Camera } from "./Camera";
import { Vec2 } from "./Util/Vec2";

// Manages a collection of items, such as drawing them together
export class ItemCollection {
  //Has its own position, which offsets all the items
  public pos = new Vec2();

  public collection: Item[] = [];

  constructor() { }

  draw(ctx: CanvasRenderingContext2D, camera: Camera) {
    // Draw with collection pos as origin
    ctx.translate(this.pos.x, this.pos.y);
    for (const object of this.collection) {
      // Optimization (Frustum Culling) 
      // Skip if no part of the item is in the viewport
      if (!camera.inViewport(object.pos, object.bounds)) continue;

      // Draw with object pos as origin
      ctx.translate(object.pos.x, object.pos.y);
      object.draw(ctx);
      ctx.translate(-object.pos.x, -object.pos.y);
    }
    ctx.translate(-this.pos.x, -this.pos.y);
  }

  public add(item: Item) {
    // Only add if not already in collection
    if (this.collection.includes(item)) return;

    this.collection.push(item);
  }
}
