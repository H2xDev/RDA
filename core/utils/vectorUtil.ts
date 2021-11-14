export interface VectorLike {
    x: number;
    y: number;
}

export class V {
    static Add(v1: VectorLike, v2: VectorLike): VectorLike {
        const { x: x1, y: y1 } = v1;
        const { x: x2, y: y2 } = v2;

        return {
            x: x1 + x2,
            y: y1 + y2,
        };
    }

    static Sub(from: VectorLike, value: VectorLike): VectorLike {
        const { x: x1, y: y1 } = from;
        const { x: x2, y: y2 } = value;

        return {
            x: x1 - x2,
            y: y1 - y2,
        }
    }

    static Copy(v: VectorLike): VectorLike {
        return JSON.parse(JSON.stringify(v));
    }

    static Dot(v1: VectorLike, v2: VectorLike): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static Mag(v1: VectorLike): number {
        return Math.sqrt(
            v1.x ** 2 + v1.y ** 2,
        );
    }

    static Ang(v: VectorLike, deg?: boolean): number {
        let res = Math.atan2(
            v.y, v.x,
        );

        if (deg) {
            res = res * 180 / Math.PI;
        }

        return res;
    }
    
    static Nrm (v: VectorLike): VectorLike {
        const m = V.Mag(v);

        return {
            x: v.x / m,
            y: v.y / m,
        }
    }

    static Cr (x: number, y: number): VectorLike {
        return {
            x, y
        };
    }
}
