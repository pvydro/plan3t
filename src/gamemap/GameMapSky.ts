import { Assets, AssetUrls } from '../asset/Assets'
import { Camera } from '../camera/Camera'
import { Sprite } from '../engine/display/Sprite'

export interface IGameMapSky {

}

export class GameMapSky extends Sprite implements IGameMapSky {
    camera: Camera
    overflowMargin: number = 30

    constructor() {
        super({ texture: PIXI.Texture.from(Assets.get(AssetUrls.SKY_DAWN)) })

        this.camera = Camera.getInstance()
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
}
