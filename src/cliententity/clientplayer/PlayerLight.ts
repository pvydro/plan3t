import { Container } from 'pixi.js'
import { Assets, AssetUrls } from '../../asset/Assets'
import { Camera } from '../../camera/Camera'
import { ILight, Light } from '../../engine/display/lighting/Light'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { Crosshair } from '../../ui/ingamehud/crosshair/Crosshair'
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
    hardLights: Light[] = []

    targetLightXVel: number = 0
    lightXVel: number = 0
    lightXVelDamping: number = 20
    targetLightYVel: number = 0
    lightYVel: number = 0
    lightYVelDamping: number = 10

    mouseOffset: IVector2 = Vector2.Zero
    mouseOffsetDamping: number = 100
    mouseOffsetXDivisor: number = 30
    mouseOffsetYDivisor: number = 20

    constructor(options: PlayerLightOptions) {
        super()

        this.player = options.player

        this.constructLights()
    }

    update() {
        const mouseOffsetX = Crosshair.getInstance().mouseDistance.x / this.mouseOffsetXDivisor
        const mouseOffsetY = Crosshair.getInstance().mouseDistance.y / this.mouseOffsetYDivisor

        this.mouseOffset.x += (mouseOffsetX - this.mouseOffset.x) / this.mouseOffsetDamping
        this.mouseOffset.y += (mouseOffsetY - this.mouseOffset.y) / this.mouseOffsetDamping

        this.targetLightXVel = this.player.xVel * 7
        this.lightXVel += (this.targetLightXVel - this.lightXVel) / this.lightXVelDamping
        this.targetLightYVel = this.player.yVel * 5
        this.lightYVel += (this.targetLightYVel - this.lightYVel) / this.lightYVelDamping

        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].update()

            this.lights[i].x = -(this.lightXVel / (i + 2)) - (this.mouseOffset.x * i)
            this.lights[i].y = -(this.lightYVel / (i + 2)) - (this.mouseOffset.y * i)
        }
    }

    constructLights() {
        const totalWidth = WindowSize.width / 20//4

        const ambientLight = new Light({
            texture: PIXI.Texture.from(Assets.get(AssetUrls.LIGHT_VIGNETTE_BORDER)),
            shouldJitter: true,
            maximumJitterAmount: 5
        })
        const ambientLightSize = 256

        ambientLight.alpha = 0.25
        ambientLight.width = ambientLightSize
        ambientLight.height = ambientLightSize

        this.lights.push(ambientLight)

        for (let i = 0; i < this.totalLights; i++) {
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
            this.hardLights.push(light)
            this.addChild(light)
        }

        this.addChild(ambientLight)
    }

    disableHardLights() {
        for (var i in this.hardLights) {
            const hardLight = this.hardLights[i]
            
            this.removeChild(hardLight)
            
            hardLight.demolish()

            delete this.hardLights[i]
        }
    }
}
