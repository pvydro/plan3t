import * as PIXI from 'pixi.js'
import { Entity } from '../../network/rooms/Entity'
import { Direction } from '../../math/Direction'
import { IClientEntity, ClientEntity } from '../ClientEntity'
import { PlayerHead } from './PlayerHead'
import { PlayerBody } from './PlayerBody'
import { GlobalScale } from '../../utils/Constants'
import { IPlayerController, PlayerController } from './PlayerController'
import { Emitter } from '../../utils/Emitter'
import { PlayerHand } from './PlayerHand'

export interface IClientPlayer extends IClientEntity {
    direction: Direction
    bodyState: PlayerBodyState
    emitter: Emitter
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
    hand: PlayerHand
    controller: IPlayerController
    clientControl: boolean = false
    _direction: Direction = Direction.Right
    _bodyState: PlayerBodyState = PlayerBodyState.Idle
    emitter: Emitter = new Emitter()

    constructor(options: ClientPlayerOptions) {
        super()
        this.clientControl = options.clientControl
        
        const player = this

        this.hand = new PlayerHand({ player })
        this.head = new PlayerHead({ player })
        this.body = new PlayerBody({ player })
        
        this.addChild(this.body)
        this.addChild(this.head)
        this.addChild(this.hand)
        
        if (this.clientControl) this.controller = new PlayerController({ player })

        this.scale = new PIXI.Point(GlobalScale, GlobalScale)
    }
    
    update() {
        if (this.clientControl) this.controller.update()
        this.head.update()
        this.body.update()
        this.hand.update()
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
