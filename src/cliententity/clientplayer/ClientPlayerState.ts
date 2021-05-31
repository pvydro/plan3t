import { Direction } from '../../engine/math/Direction'
import { point } from '../../engine/math/Vector2'
import { RoomMessage } from '../../network/rooms/ServerMessages'
import { GravityOrganism, IGravityOrganism } from '../gravityorganism/GravityOrganism'
import { ClientPlayerOptions } from './ClientPlayer'
import { IPlayerMessenger, PlayerMessenger } from './PlayerMessenger'

export enum PlayerConsciousnessState {
    Alive = 0,
    Dead = 1,
    Controlled = 2
}

export enum PlayerBodyState {
    Idle = 0,
    Walking = 1,
    Sprinting = 2
}

export enum PlayerLegsState {
    Standing = 0,
    Crouched = 1,
    Jumping = 2
}


export interface IClientPlayerState extends IGravityOrganism {
    isClientPlayer: boolean
    isOfflinePlayer: boolean
    bodyState: PlayerBodyState
    legsState: PlayerLegsState
    consciousnessState: PlayerConsciousnessState
    messenger: IPlayerMessenger
}

export class ClientPlayerState extends GravityOrganism {
    _clientControl: boolean = false
    _offlineControl: boolean = false
    _direction: Direction = Direction.Right
    _walkingDirection: Direction = Direction.Right
    _bodyState: PlayerBodyState = PlayerBodyState.Idle
    _legsState: PlayerLegsState = PlayerLegsState.Standing
    _consciousnessState: PlayerConsciousnessState = PlayerConsciousnessState.Alive
    messenger: IPlayerMessenger

    constructor(options: ClientPlayerOptions) {
        super({
            horizontalFriction: 5,
            weight: 0.5,
            gravityAnchor: point(0, 0.5),
            jumpHeight: 5
        })

        if (options.clientControl) this._clientControl = true
        if (options.offlineControl) this._offlineControl = true

        const player = this

        this.messenger = new PlayerMessenger({ player })
    }

    set onGround(value: boolean) {
        const shouldSendMessage = (this._onGround !== value)

        this._onGround = value

        if (shouldSendMessage) this.messenger.send(RoomMessage.PlayerLandedOnGround, {
            includePosition: true
        })
    }

    set walkingDirection(value: Direction) {
        const shouldSendMessage = (this._walkingDirection !== value)

        this._walkingDirection = value

        if (shouldSendMessage) this.messenger.send(RoomMessage.PlayerDirectionChanged)
    }

    set consciousnessState(value: PlayerConsciousnessState) {
        const shouldSendMessage = (this._consciousnessState !== value)

        this._consciousnessState = value
        
        if (shouldSendMessage) this.messenger.send(RoomMessage.PlayerConciousnessStateChanged)
    }

    set bodyState(value: PlayerBodyState) {
        const shouldSendMessage = (this._bodyState !== value)

        this._bodyState = value

        if (shouldSendMessage) this.messenger.send(RoomMessage.PlayerBodyStateChanged, { includePosition: true })
    }

    set legsState(value: PlayerLegsState) {
        this._legsState = value
    }

    get bodyState() {
        return this._bodyState
    }

    get legsState() {
        return this._legsState
    }

    get consciousnessState() {
        return this._consciousnessState
    }

    get isClientPlayer() {
        return this._clientControl
    }

    get isOfflinePlayer() {
        return this._offlineControl
    }

    get walkingDirection() {
        return this._walkingDirection
    }

    get direction() {
        return this._direction
    }
}
