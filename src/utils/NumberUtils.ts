export class NumberUtils {
    private constructor() {

    }

    static getRandomIntegerBetween(minimum: number, maximum: number) {
        let cs = (x,y) => x + (y - x + 1) * crypto.getRandomValues(new Uint32Array(1)) [0] / 2 ** 32 | 0

        return cs(minimum, maximum)
    }
}
