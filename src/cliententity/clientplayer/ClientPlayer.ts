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
import { Weapon } from '../../weapon/Weapon'
import { WeaponName } from '../../weapon/WeaponName'
import { InputProcessor } from '../../input/InputProcessor'
import { Key } from 'ts-keycode-enum'

export interface IClientPlayer extends IClientEntity {
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

export class ClientPlayer extends ClientEntity {
    head: PlayerHead
    body: PlayerBody
    hand: PlayerHand
    controller: IPlayerController
    _clientControl: boolean = false
    _direction: Direction = Direction.Right
    _bodyState: PlayerBodyState = PlayerBodyState.Idle
    emitter: Emitter = new Emitter()

    constructor(options: ClientPlayerOptions) {
        super()
        this._clientControl = options.clientControl
        
        const player = this

        this.hand = new PlayerHand({ player })
        this.head = new PlayerHead({ player })
        this.body = new PlayerBody({ player })
        
        this.addChild(this.body)
        this.addChild(this.head)
        this.addChild(this.hand)
        
        if (this.isClientControl) this.controller = new PlayerController({ player })

        this.scale = new PIXI.Point(GlobalScale, GlobalScale)

        // Temp
        if (options.clientControl) {
            InputProcessor.on('keydown', (ev: KeyboardEvent) => {
                if (ev.which === Key.One) {
                    this.equipWeapon(WeaponName.P3)
                } else if (ev.which === Key.Two) {
                    this.equipWeapon(WeaponName.Komp9)
                } else if (ev.which === Key.Three) {
                    this.equipWeapon(WeaponName.Bully)
                } else if (ev.which === Key.Zero) {
                    this.equipWeapon(null)
                }
            })
        }
    }
    
    update() {
        if (this.isClientControl) this.controller.update()
        this.head.update()
        this.body.update()
        this.hand.update()
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
