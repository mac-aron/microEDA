export class Vec2 {
  /* 
  X and Y are immutable after creation, otherwise confusing
  situations such as passing by reference, or having
  myVec.add(1) change the original vector could occur.

  This makes it easier to reason about the code, since any
  mutations have to be done via the = operator, e.g
  myVec = myVec.add(1);
  */
  public readonly x: number;
  public readonly y: number;

  constructor();
  constructor(x: number, y: number);
  constructor(both: number);
  constructor(arg1?: number, arg2?: number) {
    if (arg1 == undefined) {
      this.x = 0;
      this.y = 0;
    } else if (arg2 == undefined) {
      this.x = arg1;
      this.y = arg1;
    } else {
      this.x = arg1;
      this.y = arg2;
    }

    Object.freeze(this); // Ensure x and y are immutable
  }

  public add(vec: Vec2): Vec2;
  public add(x: number, y: number): Vec2;
  public add(both: number): Vec2;
  public add(arg1: number | Vec2, arg2?: number): Vec2 {
    if (arg1 instanceof Vec2) {
      return new Vec2(this.x + arg1.x, this.y + arg1.y);
    } else if (arg2 == undefined) {
      return new Vec2(this.x + arg1, this.y + arg1);
    } else {
      return new Vec2(this.x + arg1, this.y + arg2);
    }
  }

  public sub(vec: Vec2): Vec2;
  public sub(x: number, y: number): Vec2;
  public sub(both: number): Vec2;
  public sub(arg1: number | Vec2, arg2?: number): Vec2 {
    if (arg1 instanceof Vec2) {
      return new Vec2(this.x - arg1.x, this.y - arg1.y);
    } else if (arg2 == undefined) {
      return new Vec2(this.x - arg1, this.y - arg1);
    } else {
      return new Vec2(this.x - arg1, this.y - arg2);
    }
  }

  public scale(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  public div(divisor: number): Vec2 {
    if (divisor === 0) {
      throw new Error("Vec2 division by zero");
    }
    return new Vec2(this.x / divisor, this.y / divisor);
  }

  public mod(divisor: number): Vec2 {
    if (divisor === 0) {
      throw new Error("Vec2 mod by zero");
    }
    return new Vec2(this.x % divisor, this.y % divisor);
  }

  public normalize(): Vec2 {
    const len = Math.sqrt(this.x * this.x + this.y * this.y);
    if (len === 0) {
      return new Vec2();
    }
    return this.div(len);
  }

  public rotate(angle: number): Vec2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  public equal(vec: Vec2): boolean {
    return this.x === vec.x && this.y === vec.y;
  }

  public dot(vec: Vec2): number {
    return this.x * vec.x + this.y * vec.y;
  }

  public cross(vec: Vec2): number {
    return this.x * vec.y - this.y * vec.x;
  }

  public distance(vec: Vec2): number {
    return Math.sqrt((this.x - vec.x) ** 2 + (this.y - vec.y) ** 2);
  }

  public angle(): number {
    return Math.atan2(this.y, this.x);
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  // To millimeters
  public mm(): Vec2 {
    return this.scale(5);
  }

  public static fromAngle(angle: number): Vec2 {
    return new Vec2(Math.cos(angle), Math.sin(angle));
  }

  public static fromPolar(radius: number, angle: number): Vec2 {
    return Vec2.fromAngle(angle).scale(radius);
  }
}
