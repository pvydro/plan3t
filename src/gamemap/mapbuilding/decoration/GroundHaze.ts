import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../../../asset/Assets'
import { Container, IContainer } from '../../../engine/display/Container'
import { Sprite } from '../../../engine/display/Sprite'

export interface IGroundHaze extends IContainer {

}

export interface GroundHazeOptions {
    width: number
}

export class GroundHaze extends Container implements IGroundHaze {
    hazeSprites: Sprite[]
    groundWidth: number

    constructor(options: GroundHazeOptions) {
        super()

        this.groundWidth = options.width
        this.alpha = 0.25
        // this.blendMode = PIXI.BLEND_MODES.ADD
        this.constructHazeSprites()
    }

    constructHazeSprites() {
        this.hazeSprites = []
        let ph = { x: 0, height: 0, width: 0 }
        for (let i = 0; i < 10; i++) {
            const haze = new Sprite({
                texture: PIXI.Texture.from(Assets.get(AssetUrls.Haze))
            })

            // haze.alpha = 0.1
            // haze.width = this.width
            // haze.height = this.height
            haze.x = ph.x + ph.width
            haze.height *= 2
            // haze.y -= (ph.height * 0.975)
            haze.blendMode = PIXI.BLEND_MODES.SCREEN
            // PIXI.BLEND_MODES.DST_OUT

            ph = haze

            this.hazeSprites.push(haze)
            this.addChild(haze)
        }
    }
}
