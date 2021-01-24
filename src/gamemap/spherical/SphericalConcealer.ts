/**
 * The SphericalConcealer functions as a darkener for tiles that are not currently accessible by the player.
 * These tiles are hidden by the concealer.
 */

import { Spherical } from './Spherical'

export interface ISphericalConcealer {
    updateConcealer(): void
}

export class SphericalConcealer implements ISphericalConcealer {
    spherical: Spherical

    sphericalShape: PIXI.Polygon

    constructor(spherical: Spherical) {
        this.spherical = spherical
    }

    updateConcealer() {
        // Take spherical
        // Loop through collisionRects, for y then x
        // Skip first two row
        // Add (tileSize * 2) to rect left, subtract from right
        // Add 

        // Loop through tiles
        // If tile has two tiles above it & on both sides tint = 0x000000

    }
}
