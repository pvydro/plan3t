export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
    // return (1 - t) * a + t * b
}

export function getRandomFloatBetween(maximum: number, minimum: number = 0): number {
    return Math.random() * maximum + minimum
}

export function getRandomBool(): boolean {
    return Math.random() >= 0.5
}

export function getRandomIntBetween(minimum: number, maximum: number) {
    return Math.floor(Math.random() * maximum) + minimum
}
