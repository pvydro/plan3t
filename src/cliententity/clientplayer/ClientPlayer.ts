import { EntitySchema } from '../../network/schema/EntitySchema'
import { Direction } from '../../engine/math/Direction'
import { IPlayerHead, PlayerHead } from './bodyparts/PlayerHead'
import { PlayerBody } from './bodyparts/PlayerBody'
import { GlobalScale } from '../../utils/Constants'
import { IPlayerController, PlayerController } from './PlayerController'
import { Emitter } from '../../utils/Emitter'
import { IPlayerHand, PlayerHand } from './bodyparts/PlayerHand'
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
import { ISuperMe } from './superme/SuperMe'
import { TheDevil } from './superme/TheDevil'
import { PlayerBadgeFloat } from './PlayerBadgeFloat'
import { IPlayerCustomization, PlayerCustomization } from './customization/PlayerCustomization'
import { PlayerHairType } from '../../model/PlayerCustomizationTypes'

export interface IClientPlayer extends IClientPlayerState {
    sessionId: string
    playerName: string
    controller: IPlayerController
    hand: IPlayerHand
    emitter: Emitter
    holster: IPlayerWeaponHolster
    equipWeapon(weapon: Weapon): void
    getPlayerHead(): IPlayerHead
}

export interface ClientPlayerOptions {
    schema: EntitySchema
    clientControl?: boolean
    offlineControl?: boolean
    entityManager?: IEntityManager
    sessionId?: string
    playerName: string
}

export class ClientPlayer extends ClientPlayerState {
    private static Instance: ClientPlayer
    
    _entityManager?: IEntityManager
    sessionId: string = ''
    playerName: string = ''
    head: PlayerHead
    body: PlayerBody
    hand: PlayerHand
    holster: PlayerWeaponHolster
    light: PlayerLight
    collision: PlayerCollision
    controller: IPlayerController
    customization: IPlayerCustomization
    overheadHealthBar: OverheadHealthBar
    playerBadge: PlayerBadgeFloat
    superMe: ISuperMe
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
        this.playerName = options.playerName

        this.head = new PlayerHead({ player })
        this.body = new PlayerBody({ player })
        this.hand = new PlayerHand({ player })
        this.superMe = new TheDevil({ player })
        this.holster = new PlayerWeaponHolster({ player })
        this.healthController = new PlayerHealthController({ player })
        this.overheadHealthBar = new OverheadHealthBar({ player })
        this.collision = new PlayerCollision({ player })
        this.customization = new PlayerCustomization({ player })
        this.boundingBox = this.collision.boundingBox
        this.playerBadge = new PlayerBadgeFloat({ player })
        if (this.isClientPlayer) {
            this.light = new PlayerLight({ player })
            this.messenger.startSendingWeaponStatus()
        }
        
        this.addChild(this.overheadHealthBar)
        if (this.isClientPlayer) this.addChild(this.light)
        this.addChild(this.body)
        this.addChild(this.head)
        this.addChild(this.playerBadge)
        this.addChild(this.hand)
        this.addChild(this.collision)
        
        this.controller = new PlayerController({ player })

        this.scale.set(GlobalScale, GlobalScale)

        this.holster.setLoadout({
            primaryWeaponName: WeaponName.Komplimenter,
            secondaryWeaponName: WeaponName.Komp9
        })
        this.customization.apply({
            hair: PlayerHairType.FadeFro
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

        // TMP
        if (this.y > 312) {
            this.yVel = 0
            this.y = 0
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

        if (shouldSendMessage) this.messenger.send(RoomMessage.PlayerUpdate)
    }

    set walkingDirection(value: Direction) {
        const shouldSendMessage = (this._walkingDirection !== value)

        this._walkingDirection = value

        if (shouldSendMessage) this.messenger.send(RoomMessage.PlayerUpdate)
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

    getPlayerHead() {
        return this.head
    }
}
