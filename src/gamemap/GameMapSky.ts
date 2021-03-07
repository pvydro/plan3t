import { Container } from 'pixi.js'
import { Assets, AssetUrls } from '../asset/Assets'
import { Camera } from '../camera/Camera'
import { Graphix } from '../engine/display/Graphix'
import { Sprite } from '../engine/display/Sprite'
import { WindowSize } from '../utils/Constants'

export interface IGameMapSky {

}

export interface GameMapSkyOptions {
    allBlack?: boolean
}

export class GameMapSky extends Container implements IGameMapSky {
    _skyTexture
    skySprite?: Sprite | Graphix
    camera: Camera
    overflowMargin: number = 30

    constructor() {
        super()

        this._skyTexture = PIXI.Texture.from(Assets.get(AssetUrls.SKY_DAWN))
        this.camera = Camera.getInstance()
    }

    configure(options?: GameMapSkyOptions) {
        this.reset()

        if (options !== undefined && options.allBlack === true) {
            this.skySprite = new Graphix()
            this.skySprite.beginFill(0x000000)
            this.skySprite.drawIRect({ x: 0, y: 0, width: WindowSize.width, height: WindowSize.width })
            this.skySprite.endFill()
        } else {
            this.skySprite = new Sprite({ texture: this.skyTexture })
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

        this.width = window.innerWidth + (this.overflowMargin * 2)
        this.height = window.innerHeight + (this.overflowMargin * 2)
    }

    reset() {
        if (this.skySprite !== undefined) {
            this.removeChild(this.skySprite)
            this.skySprite.demolish()
            this.skySprite = undefined
        }
    }

    get skyTexture() {
        return this._skyTexture
    }
}
