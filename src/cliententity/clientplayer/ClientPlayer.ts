import * as PIXI from 'pixi.js'
import { Entity } from '../../network/rooms/Entity'
import { IClientEntity, ClientEntity } from '../ClientEntity'
import { IPlayerHead, PlayerHead } from './PlayerHead'
import { IPlayerBody, PlayerBody } from './PlayerBody'
import { Dimension } from '../../math/Dimension'
import { GlobalScale } from '../../utils/Constants'

export interface IClientPlayer extends IClientEntity {
    
}

export enum PlayerBodyState {
    Idle,
    Walking,
    Jumping
}

export class ClientPlayer extends ClientEntity {
    head: PlayerHead
    body: PlayerBody

    constructor(entity: Entity) {
        super()

        const head = new PlayerHead({ player: this })
        const body = new PlayerBody({ player: this })

        this.head = head
        this.body = body

        this.addChild(body)
        this.addChild(head)

        this.head.y -= 10
        this.head.x += 0.5

        // const head = 
        // this.head = new PlayerHead({ player, this })
        // this.scaleMeUp()
        
        this.scale = new PIXI.Point(GlobalScale, GlobalScale)
    }

    scaleMeUp() {
        this.children.forEach((child: any) => {
            (child as ClientEntity).dimension = new Dimension(child.width * 3, child.height * 3)
        })
    }
}
