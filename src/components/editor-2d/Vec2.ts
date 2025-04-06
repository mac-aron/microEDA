//Issue, Vec2.scale(myVec, 2) and mutator myVec.scale(2)
//are too easily confused, with serious consequences

//Solution? use iadd meaning in-place add, etc

//Same issue with passing by reference vs by value
export class Vec2 {
  public x: number = 0;
  public y: number = 0;

  constructor();
  constructor(x: number, y: number);
  constructor(value: number);
  constructor(vec: Vec2);
  constructor(arg1?: number | Vec2, arg2?: number) {
    if (arg1 == undefined) return;
    if (arg1 instanceof Vec2) {
      this.x = arg1.x;
      this.y = arg1.y;
      return
    }
    if (arg2 == undefined) {
      this.x = arg1;
      this.y = arg1;
      return
    }
    this.x = arg1;
    this.y = arg2;
  }

  public add(vec: Vec2): Vec2;
  public add(x: number, y: number): Vec2;
  public add(value: number): Vec2;
  public add(arg1: number | Vec2, arg2?: number): Vec2 {
    if (arg1 instanceof Vec2) {
      this.x += arg1.x;
      this.y += arg1.y;
    } else if (arg2 == undefined) {
      this.x += arg1;
      this.y += arg1;
    } else {
      this.x += arg1;
      this.y += arg2;
    }
    return this
  }

  public sub(vec: Vec2): Vec2;
  public sub(x: number, y: number): Vec2;
  public sub(value: number): Vec2;
  public sub(arg1: number | Vec2, arg2?: number): Vec2 {
    if (arg1 instanceof Vec2) {
      this.x -= arg1.x;
      this.y -= arg1.y;
    } else if (arg2 == undefined) {
      this.x -= arg1;
      this.y -= arg1;
    } else {
      this.x -= arg1;
      this.y -= arg2;
    }
    return this
  }

  public scale(scalar: number): Vec2 {
    this.x *= scalar;
    this.y *= scalar;
    return this
  }

  public div(divisor: number): Vec2 {
    if (divisor === 0) {
      throw new Error("Vec2 division by zero");
    }
    this.x /= divisor;
    this.y /= divisor;
    return this
  }

  public mod(divisor: number): Vec2 {
    if (divisor === 0) {
      throw new Error("Vec2 mod by zero");
    }
    this.x %= divisor;
    this.y %= divisor;
    return this
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
    const x = this.x * cos - this.y * sin;
    const y = this.x * sin + this.y * cos;
    this.x = x;
    this.y = y;
    return this;
  }

  // Non-mutating methods

  public equal(vec: Vec2): boolean {
    return this.x === vec.x && this.y === vec.y;
  }

  public dot(vec: Vec2): number {
    return this.x * vec.x + this.y * vec.y;
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

  public static fromAngle(angle: number): Vec2 {
    return new Vec2(Math.cos(angle), Math.sin(angle));
  }

  public static fromPolar(radius: number, angle: number): Vec2 {
    return new Vec2(radius * Math.cos(angle), radius * Math.sin(angle));
  }

  // Non-mutating versions

  public static add(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  public static sub(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  public static scale(a: Vec2, scalar: number): Vec2 {
    return new Vec2(a.x * scalar, a.y * scalar);
  }

  public static div(a: Vec2, divisor: number): Vec2 {
    if (divisor === 0) {
      throw new Error("Vec2 division by zero");
    }
    return new Vec2(a.x / divisor, a.y / divisor);
  }

  public static mod(a: Vec2, divisor: number): Vec2 {
    if (divisor === 0) {
      throw new Error("Vec2 mod by zero");
    }
    return new Vec2(a.x % divisor, a.y % divisor);
  }

  public static normalize(a: Vec2): Vec2 {
    const len = Math.sqrt(a.x * a.x + a.y * a.y);
    if (len === 0) {
      return new Vec2();
    }
    return Vec2.div(a, len);
  }

  public static rotate(a: Vec2, angle: number): Vec2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec2(a.x * cos - a.y * sin, a.x * sin + a.y * cos);
  }
}
