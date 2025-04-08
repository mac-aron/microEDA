import { Vec2 } from './Vec2';

//Immutable reperesentation of a 2D box
//with min and max corners (top-left and bottom-right)
export class Box2 {
  public readonly min: Vec2;
  public readonly max: Vec2;

  constructor(a?: Vec2, b?: Vec2) {
    if (a == undefined || b == undefined) {
      this.min = new Vec2();
      this.max = new Vec2();
    } else {
      this.min = new Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
      this.max = new Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }

    Object.freeze(this); // Ensure min and max are immutable
  }

  // Make sure to .bind the function to whatever `this` context
  // is needed, such as `myBox.apply(camera.toScreen.bind(camera))`
  public apply(func: (v: Vec2) => Vec2): Box2 {
    return new Box2(func(this.min), func(this.max));
  }

  public size(): Vec2 {
    return this.max.sub(this.min);
  }

  //TODO: Decide, contain if borderline?
  public contains(a: Box2 | Vec2): boolean {
    if (a instanceof Vec2) {
      return (
        this.min.lessThanEq(a) &&
        this.max.greaterThanEq(a)
      );
    }
    return (
      this.min.lessThanEq(a.min) &&
      this.max.greaterThanEq(a.max)
    );
  }

  //Includes being contained by other
  public intersects(other: Box2): boolean {
    return (
      this.min.lessThanEq(other.max) &&
      this.max.greaterThanEq(other.min)
    );
  }

  //Smallest box that contains both boxes
  public union(other: Box2): Box2 {
    return new Box2(
      this.min.min(other.min),
      this.max.max(other.max)
    );
  }

  public intersection(other: Box2): Box2 {
    return new Box2(
      this.min.max(other.min),
      this.max.min(other.max)
    );
  }

  public center(): Vec2 {
    return this.min.add(this.max).div(2);
  }

  //Restric the point to be within the box
  public clamp(point: Vec2): Vec2 {
    return this.min.max(point.min(this.max));
  }

  public toString(): string {
    return `Box2(${this.min.toString()}, ${this.max.toString()})`;
  }

  public static fromCenterAndSize(center: Vec2, size: Vec2): Box2 {
    const halfSize = size.div(2);
    return new Box2(
      center.sub(halfSize),
      center.add(halfSize)
    );
  }
}
