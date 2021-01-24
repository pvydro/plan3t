import * as PIXI from 'pixi.js'

export interface IPolygon {
    
}

export class Polygon extends PIXI.Polygon implements IPolygon {
    constructor(options: any) {
        super(options)
    }
}
