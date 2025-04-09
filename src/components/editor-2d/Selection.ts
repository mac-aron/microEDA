import { InteractionMode } from "./Interaction";
import { ItemCollection } from "./ItemCollection";
import { Camera } from "./Camera";
import { Vec2 } from "./Util/Vec2";
import { Box2 } from "./Util/Box2";

// Manages user selection of items (click/drag), and the
// collection of selected items
export class Selection {
  public selectedItems: ItemCollection = new ItemCollection();
  public selectableItems: ItemCollection = new ItemCollection();

  public selectionBox: Box2 = new Box2(); //In world space

  constructor() { }

  public draw(ctx: CanvasRenderingContext2D, camera: Camera, interaction: any) {
    if (interaction.mode === InteractionMode.SELECT) {
      this.drawSelectionBox(ctx, camera);
    }
    this.drawSelections(ctx, camera);
  }

  private drawSelectionBox(ctx: CanvasRenderingContext2D, camera: Camera) {
    camera.enterWorldSpace();

    ctx.strokeStyle = "rgba(80, 170, 255, 0.8)";
    ctx.lineWidth = 3;

    const pos = this.selectionBox.min;
    const size = this.selectionBox.size();

    ctx.fillStyle = "rgba(80, 170, 255, 0.2)";
    ctx.fillRect(pos.x, pos.y, size.x, size.y);
    ctx.strokeRect(pos.x, pos.y, size.x, size.y);

    camera.exitWorldSpace();
  }

  //Find all items in selection box and add them to selectedItems
  public selectFromBox() {
    for (const item of this.selectableItems.collection) {
      const itemPos = item.pos.add(this.selectableItems.pos);
      const itemBox = Box2.fromCenterAndSize(itemPos, item.bounds);

      if (this.selectionBox.contains(itemBox)) {
        this.selectedItems.add(item);
      }
    }
  }

  public deselect() {
    this.selectedItems.collection = [];
  }

  private drawSelections(ctx: CanvasRenderingContext2D, camera: Camera) {
    camera.enterWorldSpace();

    // Draw selected items
    ctx.strokeStyle = "rgba(80, 170, 255, 0.8)";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;

    for (const item of this.selectedItems.collection) {
      const itemPos = item.pos.add(this.selectedItems.pos);
      const itemBox = Box2.fromCenterAndSize(itemPos, item.bounds.add(new Vec2(20)));

      const pos = itemBox.min;
      const size = itemBox.size();

      ctx.strokeRect(pos.x, pos.y, size.x, size.y);
      ctx.fillRect(pos.x, pos.y, size.x, size.y);
    }

    camera.exitWorldSpace();
  }

  public selectItemUnderPoint(pos: Vec2) {
    const itemsUnderPoint = this.selectableItems.itemsUnderPoint(pos);
    if (itemsUnderPoint.collection.length === 0) return;

    const i = itemsUnderPoint.last();
    if (i) this.selectedItems.add(i);
  }

  public isSelectedItemUnderPoint(pos: Vec2): boolean {
    return this.selectedItems.itemsUnderPoint(pos).collection.length > 0;
  }
}
