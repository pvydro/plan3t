import { Container } from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { ILight, Light } from '../../engine/display/lighting/Light'
import { WindowSize } from '../../utils/Constants'
import { ClientPlayer } from './ClientPlayer'

export interface IPlayerLight extends ILight {

}

export interface PlayerLightOptions {
    player: ClientPlayer
}

export class PlayerLight extends Container implements IPlayerLight {
    player: ClientPlayer
    totalLights: number = 4
    lights: Light[] = []

    constructor(options: PlayerLightOptions) {
        super()

        this.constructLights()

        // this.player = options.player

        // this.x = //-this.halfWidth
        // this.y = //-this.halfHeight

        // this.alpha = 0.2
    }

    constructLights() {
        const totalWidth = WindowSize.width / 20//4

        for (var i = 0; i < this.totalLights; i++) {
            const light = new Light({ texture: PIXI.Texture.from(Assets.get(AssetUrls.LIGHT_HARD_LG)) })
            const size = totalWidth * (i + 1)

            light.width = size
            light.height = size
            light.x = -(size / 2)
            light.y = -(size / 2)

            light.alpha = 0.175//125

            this.lights.push(light)
            this.addChild(light)
        }
    }
}
