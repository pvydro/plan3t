import { Entity } from '../../network/rooms/Entity'
import { Direction } from '../../engine/math/Direction'
import { PlayerHead } from './PlayerHead'
import { PlayerBody } from './PlayerBody'
import { GlobalScale } from '../../utils/Constants'
import { IPlayerController, PlayerController } from './PlayerController'
import { Emitter } from '../../utils/Emitter'
import { PlayerHand } from './PlayerHand'
import { WeaponName } from '../../weapon/WeaponName'
import { InputProcessor } from '../../input/InputProcessor'
import { Key } from 'ts-keycode-enum'
import { GravityEntity, IGravityEntity } from '../GravityEntity'
import { PlayerCollision } from './PlayerCollision'

export interface IClientPlayer extends IGravityEntity {
    direction: Direction
    bodyState: PlayerBodyState
    emitter: Emitter
    isClientControl: boolean
    equipWeapon(name: WeaponName): void
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

export class ClientPlayer extends GravityEntity {
    head: PlayerHead
    body: PlayerBody
    hand: PlayerHand
    collision: PlayerCollision
    controller: IPlayerController
    _clientControl: boolean = false
    _direction: Direction = Direction.Right
    _bodyState: PlayerBodyState = PlayerBodyState.Idle
    emitter: Emitter = new Emitter()

    constructor(options: ClientPlayerOptions) {
        super({
            horizontalFriction: 5,
            weight: 0.01
        })

        this._clientControl = options.clientControl
        
        const player = this

        this.hand = new PlayerHand({ player })
        this.head = new PlayerHead({ player })
        this.body = new PlayerBody({ player })
        this.collision = new PlayerCollision({ player })
        this.boundingBox = this.collision.boundingBox
        
        this.addChild(this.body)
        this.addChild(this.head)
        this.addChild(this.hand)
        this.addChild(this.collision)
        
        if (this.isClientControl) this.controller = new PlayerController({ player })

        this.scale.set(GlobalScale, GlobalScale)

        // Temp
        if (options.clientControl) {
            InputProcessor.on('keydown', (ev: KeyboardEvent) => {
                if (ev.which === Key.One) {
                    this.equipWeapon(WeaponName.P3)
                } else if (ev.which === Key.Two) {
                    this.equipWeapon(WeaponName.Komp9)
                } else if (ev.which === Key.Three) {
                    this.equipWeapon(WeaponName.Bully)
                } else if (ev.which === Key.Four) {
                    this.equipWeapon(WeaponName.Raze)
                } else if (ev.which === Key.Five) {
                    this.equipWeapon(WeaponName.Tachyon)
                } else if (ev.which === Key.Six) {
                    this.equipWeapon(WeaponName.Komplimenter)
                } else if (ev.which === Key.Seven) {
                    this.equipWeapon(WeaponName.Kortni)
                } else if (ev.which === Key.Zero) {
                    this.equipWeapon(null)
                }
            })
        }
    }
    
    update() {
        if (this.isClientControl) this.controller.update()

        super.update()

        this.head.update()
        this.body.update()
        this.hand.update()

        this.collision.update()
    }

    equipWeapon(name: WeaponName | null) {
        if (name === null) {
            this.hand.empty()
        } else {
            this.hand.setWeapon(name)
        }
    }

    set bodyState(value: PlayerBodyState) {
        this._bodyState = value
    }

    set direction(value: Direction) {
        this._direction = value
        this.body.direction = value
        this.head.direction = value
        this.hand.direction = value
    }

    get bodyState() {
        return this._bodyState
    }

    get direction() {
        return this._direction
    }

    get isClientControl() {
        return this._clientControl
    }
}
