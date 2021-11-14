export interface VectorLike {
    x: number;
    y: number;
}
export declare class V {
    static Add(v1: VectorLike, v2: VectorLike): VectorLike;
    static Sub(from: VectorLike, value: VectorLike): VectorLike;
    static Copy(v: VectorLike): VectorLike;
    static Dot(v1: VectorLike, v2: VectorLike): number;
    static Mag(v1: VectorLike): number;
    static Ang(v: VectorLike, deg?: boolean): number;
    static Nrm(v: VectorLike): VectorLike;
    static Cr(x: number, y: number): VectorLike;
}
