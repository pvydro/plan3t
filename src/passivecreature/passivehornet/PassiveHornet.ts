import { Assets, AssetUrls } from '../../asset/Assets'
import { Camera } from '../../camera/Camera'
import { Sprite } from '../../engine/display/Sprite'
import { IPassiveCreature, PassiveCreature } from '../PassiveCreature'

export interface IPassiveHornet extends IPassiveCreature {

}

export class PassiveHornet extends PassiveCreature implements IPassiveHornet {
    hornetSprite: Sprite
    flyCoolDown: number = 100
    maxFlyCoolDown: number = 200
    hornetTargetX: number = 2
    hornetTargetY: number = 0
    hornetTargetXMax: number = 300
    hornetTargetYMax: number = 100

    constructor() {
        super({})

        const texture = PIXI.Texture.from(Assets.get(AssetUrls.PASSIVE_CREATURE_HORNET))
        this.hornetSprite = new Sprite({ texture })

        this.addChild(this.hornetSprite)
    }
    
    findNewPosition() {
        this.hornetTargetX = Math.random() * this.hornetTargetXMax
        this.hornetTargetY = Math.random() * this.hornetTargetYMax

        const projected = Camera.toScreen({
            x: this.hornetTargetX,
            y: this.hornetTargetY
        })

        this.hornetTargetX = projected.x
        this.hornetTargetY = projected.y
    }

    update() {
        this.flyCoolDown--

        if (this.flyCoolDown <= 0) {
            this.flyCoolDown = (Math.random() * this.maxFlyCoolDown)
            this.findNewPosition()
        }

        const differenceX = this.hornetTargetX - this.position.x
        const differenceY = this.hornetTargetY - this.position.y
        this.position.x += differenceX / 5
        this.position.y += differenceY / 5

    }

    interact() {

    }

    die() {

    }
}
