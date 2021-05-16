import * as PIXI from 'pixi.js'
import { IDemolishable } from '../../interface/IDemolishable'
import { Game } from '../../main/Game'
import { IDimension } from '../math/Dimension'
import { IRect } from '../math/Rect'
import { Graphix } from './Graphix'

export interface ISprite extends IDemolishable, IRect {
    overlayGraphic?: Graphix
    tint: number
    flipX(): void
    flipY(): void
}

export interface SpriteOverlayOptions {
    color: number
    showByDefault?: boolean
}

export interface SpriteOptions {
    texture: any
    dimension?: IDimension
    includeOverlay?: SpriteOverlayOptions
}

export class Sprite extends PIXI.Sprite implements ISprite {
    overlayGraphic?: Graphix

    constructor(options: SpriteOptions) {
        if (options.texture instanceof Graphix) {
            const gfxTexture = options.texture as Graphix
            options.texture = Game.getInstance().renderer.generateTexture(gfxTexture, 1, 1)
        }

        super(options.texture)

        if (options.dimension) {
            this.dimension = options.dimension
        }
        if (options.includeOverlay !== undefined) {
            this.initializeOverlayGraphics(options.includeOverlay)
        }
    }

    initializeOverlayGraphics(options: SpriteOverlayOptions) {
        this.overlayGraphic = new Graphix()

        this.overlayGraphic.beginFill(options.color)
        this.overlayGraphic.drawRect(0, 0, this.width, this.height)
        this.overlayGraphic.endFill()

        if (!options.showByDefault) {
            this.overlayGraphic.alpha = 0
        }

        this.addChild(this.overlayGraphic)
        this.updateOverlayDimensions()
    }

    updateOverlayDimensions() {
        if (this.overlayGraphic !== undefined) {
            this.overlayGraphic.width = this.width
            this.overlayGraphic.height = this.height
            this.overlayGraphic.x = 0
            this.overlayGraphic.y = -this.overlayGraphic.height / 2
        }
    }

    flipX() {
        this.scale.x *= -1
    }

    flipY() {
        this.scale.y *= -1
    }

    demolish() {
        this.destroy()
    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height

        this.updateOverlayDimensions()
    }

    get halfWidth() {
        return this.width / 2
    }

    get halfHeight() {
        return this.height / 2
    }
}
