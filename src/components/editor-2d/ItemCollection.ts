import { Item } from "./Item";
import { Camera } from "./Camera";
import { Vec2 } from "./Util/Vec2";

// Manages a collection of items, such as drawing them together
export class ItemCollection {
  public collection: Item[] = [];

  constructor() { }

  draw(ctx: CanvasRenderingContext2D, camera: Camera) {
    for (const object of this.collection) {
      // Optimization (Frustum Culling) 
      // Skip if no part of the item is in the viewport
      if (!camera.inViewport(object.pos, object.bounds)) continue;

      // Draw with object pos as origin
      ctx.translate(object.pos.x, object.pos.y);
      object.draw(ctx);
      ctx.translate(-object.pos.x, -object.pos.y);
    }

    this.drawCollisions(ctx);
  }

  private drawCollisions(ctx: CanvasRenderingContext2D) {
    for (const pair of this.findCollisions()) {
      const { itemA, itemB } = pair;

      // Draw collision boxes
      ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      ctx.lineWidth = 2;
      ctx.strokeRect(itemA.box.min.x, itemA.box.min.y, itemA.box.size().x, itemA.box.size().y);
      ctx.fillRect(itemA.box.min.x, itemA.box.min.y, itemA.box.size().x, itemA.box.size().y);
      ctx.strokeRect(itemB.box.min.x, itemB.box.min.y, itemB.box.size().x, itemB.box.size().y);
      ctx.fillRect(itemB.box.min.x, itemB.box.min.y, itemB.box.size().x, itemB.box.size().y);

      // Fill intersection
      const intersection = itemA.box.intersection(itemB.box);
      if (intersection) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillRect(intersection.min.x, intersection.min.y, intersection.size().x, intersection.size().y);
      }
    }
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
      if (item.box.contains(pos)) {
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

  public *findCollisions() {
    const collidables = new ItemCollection();
    for (const item of this.collection) {
      if (item.collides) {
        collidables.add(item);
      }
    }
    for (let i = 0; i < collidables.collection.length; i++) {
      const itemA = collidables.collection[i];
      for (let j = i + 1; j < collidables.collection.length; j++) {
        const itemB = collidables.collection[j];
        if (itemA.box.intersects(itemB.box)) {
          // Handle collision between itemA and itemB
          yield { itemA, itemB };
        }
      }
    }
  }
}
