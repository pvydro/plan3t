import { SphericalManipulator } from "../gamemap/spherical/manipulation/SphericalManipulator"

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

export function cloneCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const newCanvas = document.createElement('canvas')
    const context = newCanvas.getContext('2d')

    newCanvas.width = canvas.width
    newCanvas.height = canvas.height

    context.drawImage(canvas, 0, 0)

    return newCanvas
}

export function recolorCanvas2DContext(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, color: { r: number, g: number, b: number, a: number }): CanvasRenderingContext2D {
    const width = canvas.width
    const height = canvas.height

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            let iteratedPixelImageData = context.getImageData(x, y, 1, 1)
            const colorData: Uint8ClampedArray = iteratedPixelImageData.data

            const colorAlpha = colorData[3]

            if (colorAlpha !== 0) {
                iteratedPixelImageData = SphericalManipulator.applyTileDataToImageData(iteratedPixelImageData, color)
                
                colorData[0] = color.r
                colorData[1] = color.g
                colorData[2] = color.b
                colorData[3] = color.a * 255

                context.putImageData(iteratedPixelImageData, x, y)
            }
        }
    }

    return context
}
