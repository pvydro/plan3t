import { Entity } from '../../network/rooms/Entity'
import { Direction } from '../../engine/math/Direction'
import { PlayerHead } from './PlayerHead'
import { PlayerBody } from './PlayerBody'
import { GlobalScale } from '../../utils/Constants'
import { IPlayerController, PlayerController } from './PlayerController'
import { Emitter } from '../../utils/Emitter'
import { IPlayerHand, PlayerHand } from './PlayerHand'
import { WeaponName } from '../../weapon/WeaponName'
import { GravityEntity, IGravityEntity } from '../GravityEntity'
import { PlayerCollision } from './PlayerCollision'
import { IEntityManager } from '../../manager/entitymanager/EntityManager'
import { PlayerLight } from './PlayerLight'
import { Weapon } from '../../weapon/Weapon'
import { PlayerWeaponHolster } from './PlayerWeaponHolster'
import { RoomMessage } from '../../network/rooms/ServerMessages'
import { PlayerMessager } from './PlayerMessager'
import { exists } from '../../utils/Utils'
import { TextSprite } from '../../engine/display/TextSprite'
import { Fonts } from '../../asset/Fonts'
import { ParticleManager } from '../../manager/ParticleManager'

export interface IClientPlayer extends IGravityEntity {
    sessionId: string
    direction: Direction
    bodyState: PlayerBodyState
    legsState: PlayerLegsState
    hand: IPlayerHand
    emitter: Emitter
    isClientPlayer: boolean
    equipWeapon(weapon: Weapon): void
}

export enum PlayerBodyState {
    Idle = 0,
    Walking = 1
}

export enum PlayerLegsState {
    Standing = 0,
    Crouched = 1,
    Jumping = 2
}

export interface ClientPlayerOptions {
    entity: Entity
    clientControl?: boolean
    entityManager?: IEntityManager
    sessionId?: string
}

export class ClientPlayer extends GravityEntity {
    sessionId: string = ''

    private static INSTANCE: ClientPlayer
    _entityManager?: IEntityManager
    messager: PlayerMessager
    head: PlayerHead
    body: PlayerBody
    hand: PlayerHand
    holster: PlayerWeaponHolster
    light: PlayerLight
    collision: PlayerCollision
    controller: IPlayerController
    _clientControl: boolean = false
    _direction: Direction = Direction.Right
    _walkingDirection: Direction = Direction.Right
    _bodyState: PlayerBodyState = PlayerBodyState.Idle
    _legsState: PlayerLegsState = PlayerLegsState.Standing
    emitter: Emitter = new Emitter()

    static getInstance(options?: ClientPlayerOptions): ClientPlayer | undefined {
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
        const player = this

        if (options.entityManager) this._entityManager = options.entityManager
        if (exists(options.sessionId)) this.sessionId = options.sessionId
        if (options.clientControl) this._clientControl = true
        

        this.head = new PlayerHead({ player })
        this.body = new PlayerBody({ player })
        this.hand = new PlayerHand({ player })
        this.holster = new PlayerWeaponHolster({ player })
        this.messager = new PlayerMessager({ player })
        this.collision = new PlayerCollision({ player })
        this.boundingBox = this.collision.boundingBox
        if (this.isClientPlayer) {
            this.light = new PlayerLight({ player })
            this.messager.startSendingWeaponStatus()
        }
        
        if (this.isClientPlayer) this.addChild(this.light)
        this.addChild(this.body)
        this.addChild(this.head)
        this.addChild(this.hand)
        this.addChild(this.collision)

        // const testText = new TextSprite({
        //     text: 'This is a test',
        //     fontFamily: Fonts.FontStrong.fontFamily
        // })
        // this.addChild(testText)
        
        this.controller = new PlayerController({ player })

        this.scale.set(GlobalScale, GlobalScale)

        this.holster.setLoadout({
            primaryWeaponName: WeaponName.Komplimenter,
            secondaryWeaponName: WeaponName.P3
        })
    }
    
    update() {
        this.controller.update()
        
        super.update()
        
        this.body.update()
        this.head.update()
        if (this.light) this.light.update()
        if (this.isClientPlayer) {
            this.hand.update()
            this.messager.update()
        }
        
        this.collision.update()
    }

    equipWeapon(weapon: Weapon | null) {
        if (name === null) {
            this.hand.empty()
        } else {
            this.hand.setWeapon(weapon)
        }

        ParticleManager.getInstance().addTextParticle({
            text: weapon.name,
            position: {
                x: this.position.x,
                y: this.position.y
            }
        })
    }

    set bodyState(value: PlayerBodyState) {
        const shouldSendMessage = (this._bodyState !== value)

        this._bodyState = value

        if (shouldSendMessage) this.messager.send(RoomMessage.PlayerBodyStateChanged, { includePosition: true })
    }

    set legsState(value: PlayerLegsState) {
        this._legsState = value
    }

    set direction(value: Direction) {
        const shouldSendMessage = (this._direction !== value)

        this._direction = value
        this.body.direction = value
        this.head.direction = value
        this.hand.direction = value

        // if (shouldSendMessage) this.messager.send(RoomMessage.PlayerDirectionChanged)
    }

    set walkingDirection(value: Direction) {
        const shouldSendMessage = (this._walkingDirection !== value)

        this._walkingDirection = value

        if (shouldSendMessage) this.messager.send(RoomMessage.PlayerDirectionChanged)
    }

    set onGround(value: boolean) {
        const shouldSendMessage = (this._onGround !== value)

        this._onGround = value

        if (shouldSendMessage) this.messager.send(RoomMessage.PlayerLandedOnGround, {
            includePosition: true
        })
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

    get walkingDirection() {
        return this._walkingDirection
    }

    get isClientPlayer() {
        return this._clientControl
    }

    get entityManager() {
        return this._entityManager
    }
}
