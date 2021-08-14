import { Assets, AssetUrls } from '../../asset/Assets'
import { Camera } from '../../camera/Camera'
import { Sprite } from '../../engine/display/Sprite'
import { GameWindow } from '../../utils/Constants'
import { ICreature, Creature } from '../Creature'
import { CreatureType } from '../CreatureType'

export interface IPassiveHornet extends ICreature {

}

export class PassiveHornet extends Creature implements IPassiveHornet {
    hornetSprite: Sprite
    flyCoolDown: number = 100
    maxFlyCoolDown: number = 200
    minimumCorner: number = 100
    hornetTargetX: number = 2
    hornetTargetY: number = 0
    // hornetTargetXMax: number = 1300
    // hornetTargetYMax: number = 1000

    constructor() {
        super({
            type: CreatureType.PassiveHornet,
            horizontalFriction: 0,
            weight: 0,
            boundingBoxAnchor: { x: 0.5, y: 0 },
            sprites: {
                idleSpriteDef: {
                    sprite: new Sprite({ texture: PIXI.Texture.from(Assets.get(AssetUrls.PassiveCreatureHornet)) }),
                }
            },
        })
    }
    
    findNewPosition() {
        this.hornetTargetX = this.minimumCorner + Math.random() * GameWindow.fullWindowWidth//this.hornetTargetXMax
        this.hornetTargetY = this.minimumCorner + Math.random() * GameWindow.fullWindowHeight//this.hornetTargetYMax

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

    async die() {

    }
}
