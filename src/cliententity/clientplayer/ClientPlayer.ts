import { Entity } from '../../network/rooms/Entity'
import { Direction } from '../../engine/math/Direction'
import { PlayerHead } from './PlayerHead'
import { PlayerBody } from './PlayerBody'
import { GlobalScale } from '../../utils/Constants'
import { IPlayerController, PlayerController } from './PlayerController'
import { Emitter } from '../../utils/Emitter'
import { IPlayerHand, PlayerHand } from './PlayerHand'
import { WeaponName } from '../../weapon/WeaponName'
import { PlayerCollision } from './PlayerCollision'
import { IEntityManager } from '../../manager/entitymanager/EntityManager'
import { PlayerLight } from './PlayerLight'
import { Weapon } from '../../weapon/Weapon'
import { IPlayerWeaponHolster, PlayerWeaponHolster } from './PlayerWeaponHolster'
import { RoomMessage } from '../../network/rooms/ServerMessages'
import { exists } from '../../utils/Utils'
import { ParticleManager } from '../../manager/particlemanager/ParticleManager'
import { OverheadHealthBar } from '../../ui/ingamehud/healthbar/OverheadHealthBar'
import { PlayerHealthController } from './PlayerHealthController'
import { ClientPlayerState, IClientPlayerState, PlayerConsciousnessState } from './ClientPlayerState'

export interface IClientPlayer extends IClientPlayerState {
    sessionId: string
    controller: IPlayerController
    hand: IPlayerHand
    emitter: Emitter
    holster: IPlayerWeaponHolster
    equipWeapon(weapon: Weapon): void
}

export interface ClientPlayerOptions {
    entity: Entity
    clientControl?: boolean
    offlineControl?: boolean
    entityManager?: IEntityManager
    sessionId?: string
}

export class ClientPlayer extends ClientPlayerState {
    private static Instance: ClientPlayer
    
    _entityManager?: IEntityManager
    sessionId: string = ''
    head: PlayerHead
    body: PlayerBody
    hand: PlayerHand
    holster: PlayerWeaponHolster
    light: PlayerLight
    collision: PlayerCollision
    controller: IPlayerController
    overheadHealthBar: OverheadHealthBar
    emitter: Emitter = new Emitter()

    static getInstance(options?: ClientPlayerOptions): ClientPlayer | undefined {
        if (ClientPlayer.Instance === undefined) {
            if (options === undefined) {
                return undefined
            } else {
                ClientPlayer.Instance = new ClientPlayer(options)
            }
        }

        return ClientPlayer.Instance
    }

    constructor(options: ClientPlayerOptions) {
        super(options)
        const player = this

        if (options.entityManager) this._entityManager = options.entityManager
        if (exists(options.sessionId)) this.sessionId = options.sessionId

        this.head = new PlayerHead({ player })
        this.body = new PlayerBody({ player })
        this.hand = new PlayerHand({ player })
        this.holster = new PlayerWeaponHolster({ player })
        this.healthController = new PlayerHealthController({ player })
        this.overheadHealthBar = new OverheadHealthBar({ player })
        this.collision = new PlayerCollision({ player })
        this.boundingBox = this.collision.boundingBox
        if (this.isClientPlayer) {
            this.light = new PlayerLight({ player })
            this.messenger.startSendingWeaponStatus()
        }
        
        this.addChild(this.overheadHealthBar)
        if (this.isClientPlayer) this.addChild(this.light)
        this.addChild(this.body)
        this.addChild(this.head)
        this.addChild(this.hand)
        this.addChild(this.collision)
        
        this.controller = new PlayerController({ player })

        this.scale.set(GlobalScale, GlobalScale)

        this.holster.setLoadout({
            primaryWeaponName: WeaponName.Komplimenter,
            secondaryWeaponName: WeaponName.Komp9
        })
    }
    
    update() {
        this.controller.update()
        
        super.update()
        
        this.body.update()
        this.head.update()
        this.hand.update()
        this.overheadHealthBar.update()
        if (this.light) this.light.update()
        if (this.isClientPlayer) {
            this.messenger.update()
        }
    }

    equipWeapon(weapon: Weapon | null) {
        if (name === null) {
            this.hand.empty()
        } else {
            this.hand.setWeapon(weapon)
        }

        // Weapon-name particle
        const particlePosition = { x: this.position.x, y: this.position.y - 24 }

        ParticleManager.getInstance().addTextParticle({
            text: weapon.name.toUpperCase(),
            position: particlePosition,
            startAlpha: 0.75
        })
    }

    requestRespawn() {
        if (this.consciousnessState !== PlayerConsciousnessState.Dead) {
            return
        }

        this.consciousnessState = PlayerConsciousnessState.Alive
        this.healthController.resetHealth()
    }

    set direction(value: Direction) {        
        const shouldSendMessage = (this._direction !== value)

        this._direction = value
        this.body.direction = value
        this.head.direction = value
        this.hand.direction = value

        if (shouldSendMessage) this.messenger.send(RoomMessage.PlayerDirectionChanged)
    }

    set walkingDirection(value: Direction) {
        const shouldSendMessage = (this._walkingDirection !== value)

        this._walkingDirection = value

        if (shouldSendMessage) this.messenger.send(RoomMessage.PlayerDirectionChanged)
    }

    get direction() {
        return this._direction
    }

    get walkingDirection() {
        return this._walkingDirection
    }

    get entityManager() {
        return this._entityManager
    }
}
