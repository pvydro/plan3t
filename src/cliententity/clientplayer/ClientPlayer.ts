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
import { Weapon } from '../../weapon/Weapon'
import { PlayerWeaponHolster } from './PlayerWeaponHolster'
import { InGameHUD } from '../../ui/ingamehud/InGameHUD'

export interface IClientPlayer extends IGravityEntity {
    direction: Direction
    bodyState: PlayerBodyState
    emitter: Emitter
    isClientPlayer: boolean
    equipWeapon(weapon: Weapon): void
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
    private static INSTANCE: ClientPlayer
    _entityManager?: EntityManager
    head: PlayerHead
    body: PlayerBody
    hand: PlayerHand
    holster: PlayerWeaponHolster
    light: PlayerLight
    collision: PlayerCollision
    controller: IPlayerController
    _clientControl: boolean = false
    _direction: Direction = Direction.Right
    _bodyState: PlayerBodyState = PlayerBodyState.Idle
    _legsState: PlayerLegsState = PlayerLegsState.Standing
    emitter: Emitter = new Emitter()

    static getInstance(options?: ClientPlayerOptions) {
        if (ClientPlayer.INSTANCE === undefined) {
            if (options === undefined) {
                return undefined
            } else {
                ClientPlayer.INSTANCE = new ClientPlayer(options)
            }
        }

        return ClientPlayer.INSTANCE
    }

    constructor(options: ClientPlayerOptions) {
        super({
            horizontalFriction: 5,
            weight: 0.5
        })
        if (options.entityManager) {
            this._entityManager = options.entityManager
        }
        this._clientControl = options.clientControl
        
        const player = this

        this.head = new PlayerHead({ player })
        this.body = new PlayerBody({ player })
        this.hand = new PlayerHand({ player })
        this.holster = new PlayerWeaponHolster({ player })
        this.light = new PlayerLight({ player })
        this.collision = new PlayerCollision({ player })
        this.boundingBox = this.collision.boundingBox
        
        this.addChild(this.light)
        this.addChild(this.body)
        this.addChild(this.head)
        this.addChild(this.hand)
        this.addChild(this.collision)
        
        if (this.isClientPlayer) this.controller = new PlayerController({ player })

        this.scale.set(GlobalScale, GlobalScale)

        this.holster.setLoadout({
            primaryWeaponName: WeaponName.Komplimenter,
            secondaryWeaponName: WeaponName.P3
        })
    }
    
    update() {
        if (this.isClientPlayer) this.controller.update()

        super.update()

        this.head.update()
        this.body.update()
        this.hand.update()
        this.light.update()

        this.collision.update()
    }

    equipWeapon(weapon: Weapon | null) {
        if (name === null) {
            this.hand.empty()
        } else {
            this.hand.setWeapon(weapon)
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

    get isClientPlayer() {
        return this._clientControl
    }

    get entityManager() {
        return this._entityManager
    }
}
