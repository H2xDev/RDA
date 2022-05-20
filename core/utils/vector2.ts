export interface Vector2 {
    x: number;
    y: number;
}

export class VUpdate {
    constructor(private v: Vector2) {
        this.v = v;
    }

    div(by: number) {
        this.v.x /= by;
        this.v.y /= by;
        
        return this;
    }

    pow(n: number) {
        this.v.x = this.v.x ** n;
        this.v.y = this.v.y ** n;

        return this;
    }

    mul(by: number) {
        this.v.x *= by;
        this.v.y *= by;

        return this;
    }

    mul2(n: Vector2) {
        this.v.x *= n.x;
        this.v.y *= n.y;

        return this;
    }

    add(n: Vector2) {
        this.v.x += n.x;
        this.v.y += n.y;

        return this;
    }

    sub(n: Vector2) {
        this.v.x -= n.x;
        this.v.y -= n.y;

        return this;
    }

    set(n: Vector2) {
        this.v.x = n.x;
        this.v.y = n.y;

        return this;
    }

    zero() {
        this.v.x = 0;
        this.v.y = 0;

        return this;
    }

    invert() {
        this.v.x *= -1;
        this.v.y *= -1;

        return this;
    }

    normalize() {
        const m = V.mag(this.v);
        this.v.x /= m;
        this.v.y /= m;

        return this;
    }

    done() {
        return this.v;
    }

    setTo(n: Vector2) {
        n.x = this.v.x;
        n.y = this.v.y;
        this.v = n;
        
        return this;
    }

    lerp(to: Vector2, smoothness: number) {
        const delta = V.dist2(to, this.v);
        const step = V.update(delta)
            .div(smoothness)
            .done();

        return this.sub(step);
    }

    rotate(a: number) {
        const length = V.mag(this.v);
        const b = V.angle(this.v) + a;
        const ref = V.fromAngle(b, length);
        this.v.x = ref.x;
        this.v.y = ref.y;
        return this;
    }

    reflect(no: Vector2) {
        // Vnew = -2*(V dot N)*N + V
        const { v } = this;
        const n = V.normalize(no);

        const r = V.sub(v, V.mul(n, 2 * V.dot(v, n)));

        return this.set(r);
    }

    round() {
        this.v.x = Math.round(this.v.x);
        this.v.y = Math.round(this.v.y);

        return this;
    }

    floor() {
        this.v.x = Math.floor(this.v.x);
        this.v.y = Math.floor(this.v.y);

        return this;
    }
}

export class V {
    static update(v: Vector2) {
        return new VUpdate(v);
    }

    static copy(v: Vector2) {
        return {
            x: v.x,
            y: v.y,
        };
    }

    static zero() {
        return {
            x: 0,
            y: 0,
        };
    }

    static mag(v: Vector2) {
        return Math.sqrt(v.x ** 2 + v.y ** 2);
    }

    static dist(a: Vector2, b: Vector2) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;

        return Math.sqrt(dx ** 2 + dy ** 2);
    }

    static dist2(a: Vector2, b: Vector2) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;

        return {
            x: dx,
            y: dy,
        };
    }

    static add(...args: Vector2[]) {
        return args.reduce((p, c) => {
            return {
                x: p.x + c.x,
                y: p.y + c.y,
            }
        }, { x: 0, y: 0 });
    }

    static sub(...args: Vector2[]) {
        return args.reduce((p, c) => {
            return {
                x: p.x - c.x,
                y: p.y - c.y,
            }
        }, args.shift()!);
    }

    static mul(a: Vector2, n: number) {
        return {
            x: a.x * n,
            y: a.y * n,
        };
    }

    static mul2(a: Vector2, b: Vector2) {
        return {
            x: a.x * b.x,
            y: a.y * b.y,
        };
    }

    static pow(a: Vector2, n: number) {
        return {
            x: a.x ** n,
            y: a.y ** n,
        };
    }

    static div(a: Vector2, n: number) {
        return {
            x: a.x / n,
            y: a.y / n,
        };
    }

    static div2(a: Vector2, b: Vector2) {
        return {
            x: a.x / b.x,
            y: a.y / b.y,
        };
    }

    static sign(a: Vector2) {
        return {
            x: Math.sign(a.x),
            y: Math.sign(a.y),
        };
    }

    static onlyX(a: Vector2) {
        return {
            x: a.x,
            y: 0,
        };
    }

    static onlyY(a: Vector2) {
        return {
            x: 0,
            y: a.y,
        };
    }

    static normalize(a: Vector2) {
        const m = V.mag(a);
        return {
            x: a.x / m,
            y: a.y / m,
        };
    }

    static asArray(n: Vector2): [number, number] {
        return [ n.x, n.y ];
    }

    static fromArray([x, y]: [number, number]) {
        return { x, y };
    }

    static angle(a: Vector2) {
        return Math.atan2(a.y, a.x);
    }

    static normal(v: Vector2) {
        return {
            x: v.y,
            y: -v.x,
        };
    }

    static addRight(a: Vector2, length = 1) {
        const b = V.angle(a) + Math.PI / 2;
        return V.add(a, V.fromAngle(b, length));
    }

    static fromAngle(rad: number, length = 1) {
        return {
            x: Math.cos(rad) * length,
            y: Math.sin(rad) * length,
        };
    }

    static dot(a: Vector2, b: Vector2) {
        return a.x * b.x + a.y * b.y;
    }
};
