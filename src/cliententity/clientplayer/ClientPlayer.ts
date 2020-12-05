import * as PIXI from 'pixi.js'
import { Entity } from '../../network/rooms/Entity'
import { Direction } from '../../math/Direction'
import { IClientEntity, ClientEntity } from '../ClientEntity'
import { PlayerHead } from './PlayerHead'
import { PlayerBody } from './PlayerBody'
import { GlobalScale } from '../../utils/Constants'
import { IPlayerController, PlayerController } from './PlayerController'
import { LoggingService } from '../../service/LoggingService'

export interface IClientPlayer extends IClientEntity {
    bodyState: PlayerBodyState
}

export enum PlayerBodyState {
    Idle = 'IDLE',
    Walking = 'WALKING',
    Jumping = 'JUMPING'
}

export class ClientPlayer extends ClientEntity {
    head: PlayerHead
    body: PlayerBody
    controller: IPlayerController
    _direction: Direction = Direction.Right
    _bodyState: PlayerBodyState = PlayerBodyState.Idle

    constructor(entity: Entity) {
        super()
        const player = this

        const head = new PlayerHead({ player })
        const body = new PlayerBody({ player })
        
        this.head = head
        this.body = body
        this.controller = new PlayerController({ player })

        this.addChild(body)
        this.addChild(head)

        this.head.y -= 10
        this.head.x += 0.5

        // const head = 
        // this.head = new PlayerHead({ player, this })
        // this.scaleMeUp()
        
        this.scale = new PIXI.Point(GlobalScale, GlobalScale)
    }
    
    update() {
        this.controller.update()
        this.head.update()
        this.body.update()
    }

    set bodyState(value: PlayerBodyState) {
        LoggingService.log('ClientPlayer', 'bodyState set', value)
        this._bodyState = value
    }

    set direction(value: Direction) {
        this._direction = value
    }

    get bodyState() {
        return this._bodyState
    }

    get direction() {
        return this._direction
    }
}
