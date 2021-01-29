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

    targetLightXVel: number = 0
    lightXVel: number = 0
    lightXVelDamping: number = 20
    targetLightYVel: number = 0
    lightYVel: number = 0
    lightYVelDamping: number = 10

    constructor(options: PlayerLightOptions) {
        super()

        this.player = options.player

        this.constructLights()
    }

    update() {
        this.targetLightXVel = this.player.xVel * 7
        this.lightXVel += (this.targetLightXVel - this.lightXVel) / this.lightXVelDamping
        this.targetLightYVel = this.player.yVel * 5
        this.lightYVel += (this.targetLightYVel - this.lightYVel) / this.lightYVelDamping

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update()
            this.lights[i].x = -(this.lightXVel / (i + 2))
            this.lights[i].y = -(this.lightYVel / (i + 2))
        }
    }

    constructLights() {
        const totalWidth = WindowSize.width / 20//4

        for (var i = 0; i < this.totalLights; i++) {
            const light = new Light({
                texture: PIXI.Texture.from(Assets.get(AssetUrls.LIGHT_HARD_LG)),
                shouldJitter: true,
                maximumJitterAmount: 2
            })
            const size = totalWidth * (i + 1)

            light.width = size
            light.height = size

            light.alpha = 0.175//125

            this.lights.push(light)
            this.addChild(light)
        }

        const ambientLight = new Light({
            texture: PIXI.Texture.from(Assets.get(AssetUrls.LIGHT_VIGNETTE_BORDER)),
            shouldJitter: true,
            maximumJitterAmount: 5
        })
        ambientLight.alpha = 0.25
        ambientLight.scale.set(1.5, 1.5)

        this.lights.push(ambientLight)

        this.addChild(ambientLight)
    }
}
