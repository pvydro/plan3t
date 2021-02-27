import { Assets, AssetUrls } from '../../asset/Assets'
import { Camera } from '../../camera/Camera'
import { Sprite } from '../../engine/display/Sprite'
import { ICreature, Creature, CreatureType } from '../Creature'

export interface IPassiveHornet extends ICreature {

}

export class PassiveHornet extends Creature implements IPassiveHornet {
    hornetSprite: Sprite
    flyCoolDown: number = 100
    maxFlyCoolDown: number = 200
    hornetTargetX: number = 2
    hornetTargetY: number = 0
    hornetTargetXMax: number = 300
    hornetTargetYMax: number = 100

    constructor() {
        super({
            type: CreatureType.PassiveHornet,
            horizontalFriction: 0,
            weight: 0,
            idleSprite: new Sprite({ texture: PIXI.Texture.from(Assets.get(AssetUrls.PASSIVE_CREATURE_HORNET)) }),
            boundingBoxAnchor: { x: 0.5, y: 0 }
        })
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
