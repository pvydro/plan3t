import { Assets, AssetUrls } from '../asset/Assets'
import { Camera } from '../camera/Camera'
import { Container } from '../engine/display/Container'
import { Graphix } from '../engine/display/Graphix'
import { Sprite } from '../engine/display/Sprite'
import { Dimension, IDimension } from '../engine/math/Dimension'
import { GameWindow } from '../utils/Constants'

export interface IGameMapSky {

}

export interface GameMapSkyOptions {
    allBlack?: boolean
}

export class GameMapSky extends Container implements IGameMapSky {
    _addedRepositionListeners: boolean = false
    skyDimensions: IDimension = new Dimension(0, 0)
    skySprite?: Sprite | Graphix
    camera: Camera
    overflowMargin: number = 30

    constructor(options?: GameMapSkyOptions) {
        super()

        this.camera = Camera.getInstance()

        // this.reposition(true)
        this.configure(options)
    }

    /**
     * @deprecated
     */
    configure(options?: GameMapSkyOptions) {
        this.reset()

        if (options !== undefined && options.allBlack) {
            this.skySprite = new Graphix()
            this.skySprite.beginFill(0x000000)
            this.skySprite.drawIRect({ x: 0, y: 0, width: GameWindow.width, height: GameWindow.width })
            this.skySprite.endFill()
        } else {
            const skyTexture = PIXI.Texture.from(Assets.get(AssetUrls.SkyDay))

            this.skySprite = new Sprite({ texture: skyTexture })
            // this.skySprite//.dimension = this.skyDimensions
        }
        
        this.addChild(this.skySprite)
    }

    update() {
        const zeroProjected = this.camera.toScreen({
            x: -this.overflowMargin,
            y: -this.overflowMargin
        })
        this.x = zeroProjected.x
        this.y = zeroProjected.y
    }

    reset() {
        if (this.skySprite !== undefined) {
            this.removeChild(this.skySprite)
            this.skySprite.demolish()
            this.skySprite = undefined
        }
    }

    // reposition(addListener?: boolean) {
    //     log('GameMapSky', 'reposition')

    //     // Listeners
    //     if (addListener && !this._addedRepositionListeners) {
    //         this._addedRepositionListeners = true

    //         InputProcessor.on(InputEvents.Resize, () => {
    //             this.reposition(false)
    //         })
    //     }

    //     // Properties
    //     this.skyDimensions.width = window.innerWidth + (this.overflowMargin * 2)
    //     this.skyDimensions.height = window.innerHeight + (this.overflowMargin * 2)

    //     if (this.skySprite && (this.skySprite as Sprite)) {
    //         (this.skySprite as Sprite).dimension = this.skyDimensions
    //     }

    //     log('GameMapSky', 'New sky dimensions', { 'width': this.skyDimensions.width, 'height': this.skyDimensions.height })
    // }
}
