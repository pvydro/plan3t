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
import { EntityManager } from '../../manager/EntityManager'
import { Light } from '../../engine/display/lighting/Light'
import { PlayerLight } from './PlayerLight'

export interface IClientPlayer extends IGravityEntity {
    direction: Direction
    bodyState: PlayerBodyState
    emitter: Emitter
    isClientControl: boolean
    equipWeapon(name: WeaponName): void
}

export enum PlayerBodyState {
    Idle = 'Idle',
    Walking = 'Walking',
    Jumping = 'Jumping'
}

export enum PlayerLegsState {
    Standing = 'Idle',
    Crouched = 'Crouched'
}

export interface ClientPlayerOptions {
    entity: Entity
    clientControl?: boolean
    entityManager?: EntityManager
}

export class ClientPlayer extends GravityEntity {
    _entityManager?: EntityManager
    head: PlayerHead
    body: PlayerBody
    hand: PlayerHand
    light: PlayerLight
    collision: PlayerCollision
    controller: IPlayerController
    _clientControl: boolean = false
    _direction: Direction = Direction.Right
    _bodyState: PlayerBodyState = PlayerBodyState.Idle
    _legsState: PlayerLegsState = PlayerLegsState.Standing
    emitter: Emitter = new Emitter()

    constructor(options: ClientPlayerOptions) {
        super({
            horizontalFriction: 5,
            weight: 0.5
        })
        if (options.entityManager) {
            this._entityManager = options.entityManager
        }
        this._clientControl = options.clientControl

        // Temp
        // const tempLight = new Light()
        // tempLight.width = window.innerWidth / 4
        // tempLight.height = window.innerHeight / 4
        // tempLight.x = -(tempLight.width / 2)
        // tempLight.y = -(tempLight.height / 2)
        // tempLight.alpha = 0.3//0.2//0.15
        // this.addChild(tempLight)
        
        const player = this

        this.hand = new PlayerHand({ player })
        this.head = new PlayerHead({ player })
        this.body = new PlayerBody({ player })
        this.light = new PlayerLight({ player })
        this.collision = new PlayerCollision({ player })
        this.boundingBox = this.collision.boundingBox
        
        this.addChild(this.light)
        this.addChild(this.body)
        this.addChild(this.head)
        this.addChild(this.hand)
        this.addChild(this.collision)
        
        if (this.isClientControl) this.controller = new PlayerController({ player })

        this.scale.set(GlobalScale, GlobalScale)


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
        this.light.update()

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

    set legsState(value: PlayerLegsState) {
        this._legsState = value
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

    get legsState() {
        return this._legsState
    }

    get direction() {
        return this._direction
    }

    get isClientControl() {
        return this._clientControl
    }

    get entityManager() {
        return this._entityManager
    }
}
