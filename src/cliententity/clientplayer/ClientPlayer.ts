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

export interface ClientPlayerOptions {
    entity: Entity
    clientControl?: boolean
}

export class ClientPlayer extends ClientEntity {
    head: PlayerHead
    body: PlayerBody
    controller: IPlayerController
    clientControl: boolean = false
    _direction: Direction = Direction.Right
    _bodyState: PlayerBodyState = PlayerBodyState.Idle

    constructor(options: ClientPlayerOptions) {
        super()
        this.clientControl = options.clientControl
        
        const player = this

        const head = new PlayerHead({ player })
        const body = new PlayerBody({ player })
        
        this.head = head
        this.body = body
        if (this.clientControl) this.controller = new PlayerController({ player })

        this.addChild(body)
        this.addChild(head)

        this.head.y -= 10

        this.scale = new PIXI.Point(GlobalScale, GlobalScale)
    }
    
    update() {
        if (this.clientControl) this.controller.update()
        this.head.update()
        this.body.update()
    }

    set bodyState(value: PlayerBodyState) {
        this._bodyState = value
    }

    set direction(value: Direction) {
        this._direction = value
        this.body.direction = value
        this.head.direction = value
    }

    get bodyState() {
        return this._bodyState
    }

    get direction() {
        return this._direction
    }
}
