import { Camera } from "./Camera";
import { Interaction } from "./Interaction";
import { Vec2 } from "./Util/Vec2";
import { Item } from "./Item";
import { ItemCollection } from "./ItemCollection";
import { Selection } from "./Selection";

export class CanvasRenderer {
  private camera: Camera;
  private interaction: Interaction;

  // Conversion from pixels to millimeters
  private mm = (a: number) => 5 * a;

  // Color palette used for drawing elements
  private palette = {
    background: "#ffffff",
    grid: "#ffffff",
    gridLine: "#cccccc",
    gridText: "#000000",
  };

  private items: ItemCollection;
  private selection = new Selection();

  /**
   * Constructor initializes the renderer with a canvas and context.
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
   * @param {CanvasRenderingContext2D} ctx - The 2D context for rendering.
   */
  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {
    this.camera = new Camera(this.canvas, ctx);
    this.interaction = new Interaction(canvas, ctx, this.camera, this.selection);
    console.log(this)


    this.items = new ItemCollection();
    this.selection.selectableItems = this.items;

    this.items.add(new Item(new Vec2(0, 0), new Vec2(100, 100)));

    const box2 = new Item(new Vec2(200, 200), new Vec2(100, 100));
    box2.path = new Path2D();
    box2.path.rect(-50, -50, 100, 100);
    this.items.add(box2);

    const text = new Item(new Vec2(0, -110), new Vec2(50, 40));
    //Create custom SVG element for text
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", text.bounds.x+'mm');
    svg.setAttribute("height", text.bounds.y+'mm');
    svg.setAttribute("viewBox", "-10 -10 20 20");
    svg.setAttribute("style", "font-size: 20px; fill: #000000;");
    svg.innerHTML = "<text x='-10' y='7'>Hi</text>";
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const i = new Image();
    i.src = url;
    i.onload = () => {
      text.img = i;
      this.items.add(text);
    }

    const imgItem = new Item(new Vec2(0, 0), new Vec2(0));
    const img = new Image();
    img.src = "./f-cu.svg";
    img.onload = () => {
      imgItem.img = img;
      imgItem.bounds = new Vec2(img.width, img.height).mm()
      this.items.collection.unshift(imgItem);
    }
  }

  /**
   * Draws an entire frame, clearing the canvas first.
   */
  public drawFrame() {
    this.ctx.clearRect(0, 0, this.camera.viewport().x, this.camera.viewport().y);

    //Enter world space
    this.camera.enterWorldSpace();

    this.drawGrid();
    this.items.draw(this.ctx, this.camera);

    //Exit world space
    this.camera.exitWorldSpace();

    // this.debugCursor();

    //Draw selection related things like selection box, if needed
    this.selection.draw(this.ctx, this.camera, this.interaction);
    this.drawText();
  }

  private drawGrid() {
    const gridSize = this.mm(10);

    let start = this.camera.toWorld(new Vec2(0)).sub(gridSize);
    let end = this.camera.toWorld(this.camera.viewport());
    start = start.sub(start.mod(gridSize));

    this.ctx.strokeStyle = this.palette.gridLine;
    this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    for (let x = start.x; x < end.x; x += gridSize) {
      this.ctx.moveTo(x, start.y);
      this.ctx.lineTo(x, end.y);
    }
    for (let y = start.y; y < end.y; y += gridSize) {
      this.ctx.moveTo(start.x, y);
      this.ctx.lineTo(end.x, y);
    }
    this.ctx.stroke();
  }

  private drawText() {
    this.ctx.fillStyle = this.palette.gridText;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("Hi", 10, 10);
  }

  private debugCursor() {
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillStyle = "#ff0000"; //Screen space
    const mousePos = this.interaction.cursor;
    this.ctx.fillRect(mousePos.x, mousePos.y, 30, 30);

    this.camera.enterWorldSpace();
    const pos = this.camera.toWorld(mousePos);
    this.ctx.fillStyle = "#0000ff"; //toWorld space
    this.ctx.fillRect(pos.x, pos.y, 30, 30);
    const pos2 = this.camera.toScreen(pos);
    this.camera.exitWorldSpace();

    this.ctx.fillStyle = "#00ff00"; //toScreen space
    this.ctx.fillRect(pos2.x - 30, pos2.y - 30, 30, 30);
    this.ctx.globalAlpha = 1;
  }
}
