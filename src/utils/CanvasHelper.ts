export function trimCanvas(c: HTMLCanvasElement) {
    const ctx = c.getContext('2d'),
        copy = document.createElement('canvas').getContext('2d'),
        pixels = ctx.getImageData(0, 0, c.width, c.height),
        l = pixels.data.length,
        bounds = {
            top: null,
            left: null,
            right: null,
            bottom: null
        }
    let i: number, x: number, y: number

    for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % c.width
            y = ~~((i / 4) / c.width)

            if (bounds.top === null) {
                bounds.top = y
            }

            if (bounds.left === null) {
                bounds.left = x
            } else if (x < bounds.left) {
                bounds.left = x
            }

            if (bounds.right === null) {
                bounds.right = x
            } else if (bounds.right < x) {
                bounds.right = x
            }

            if (bounds.bottom === null) {
                bounds.bottom = y
            } else if (bounds.bottom < y) {
                bounds.bottom = y
            }
        }
    }

    const trimHeight = bounds.bottom - bounds.top,
        trimWidth = bounds.right - bounds.left,
        trimmed = ctx.getImageData(bounds.left, bounds.top, trimWidth, trimHeight)

    copy.canvas.width = trimWidth
    copy.canvas.height = trimHeight
    copy.putImageData(trimmed, 0, 0)

    return copy.canvas
}
