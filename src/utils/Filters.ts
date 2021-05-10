import * as PIXI from 'pixi.js'
import { exists } from './Utils'

interface ColorMatrixFilterOptions {
    vintage?: boolean
    polaroid?: boolean
    desaturate?: boolean
    greyscale?: number
    night?: number
}

export class Filters {
    private constructor() {}

    static getColorMatrixFilter(options: ColorMatrixFilterOptions) {
        const filter = new PIXI.filters.ColorMatrixFilter()

        if (exists(options.greyscale)) filter.greyscale(options.greyscale, true)
        if (options.desaturate) filter.desaturate()
        if (options.vintage) filter.vintage(true)
        if (options.polaroid) filter.polaroid(true)
        if (exists(options.night)) filter.night(options.night, true)

        return filter
    }
}