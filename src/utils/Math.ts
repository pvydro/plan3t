export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
    // return (1 - t) * a + t * b
}
