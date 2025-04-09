import { Item } from "./Item";
import { Camera } from "./Camera";
import { Vec2 } from "./Util/Vec2";
import { Box2 } from "./Util/Box2";

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

  public last() {
    if (this.collection.length === 0) return null;
    return this.collection[this.collection.length - 1];
  }

  public itemsUnderPoint(pos: Vec2): ItemCollection {
    const itemsUnderPoint = new ItemCollection();
    for (const item of this.collection) {
      const itemBox = Box2.fromCenterAndSize(item.pos.add(this.pos), item.bounds);
      if (itemBox.contains(pos)) {
        itemsUnderPoint.add(item);
      }
    }
    return itemsUnderPoint;
  }

  public moveItems(offset: Vec2) {
    for (const item of this.collection) {
      item.pos = item.pos.add(offset);
    }
  }
}
