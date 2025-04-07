import { Vec2 } from "./Vec2";
import { Item } from "./Item";

export class ItemCollection {
  public pos = new Vec2();
  public collection: Item[] = [];

  constructor() { }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw with collection pos as origin
    ctx.translate(this.pos.x, this.pos.y);
    for (const object of this.collection) {
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
