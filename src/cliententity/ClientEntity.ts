import { Entity } from '../network/rooms/Entity'
import { Sprite } from '../engine/display/Sprite'
import { IContainer, Container } from '../engine/display/Container'
import { IDimension } from '../engine/math/Dimension'
import { IUpdatable } from '../interface/IUpdatable'
import { IVector2 } from '../engine/math/Vector2'

export interface IClientEntity extends IContainer, IUpdatable {
    x: number
    y: number
    halfWidth: number
    halfHeight: number
    xVel: number
    yVel: number
    type: string
    position: IVector2
    entityId: string
}

export enum EntityType {
    ClientPlayer = 'ClientPlayer',
    EnemyPlayer = 'EnemyPlayer',
    EnemyBall = 'EnemyBall',
    Bullet = 'Bullet'
}

export interface ClientEntityOptions {
    entity?: Entity
    sprite?: Sprite
}

export class ClientEntity extends Container implements IClientEntity {
    static CurrentIDIteration: number = 0
    protected _xVel: number = 0
    protected _yVel: number = 0
    entityId: string
    sprite: Sprite
    entity?: Entity
    x: number
    y: number
    type: EntityType

    constructor(options?: ClientEntityOptions) {
        super()

        if (options) {
            this.entity = options.entity
            this.sprite = options.sprite
        }

        if (this.entity !== undefined) {
            this.position.set(this.entity.x, this.entity.y)
        }

        if (this.sprite !== undefined) {
            this.addChild(this.sprite)
        }

        this.entityId = (ClientEntity.CurrentIDIteration++).toString()
    }

    update() {

    }

    get halfWidth() {
        return this.width / 2
    }

    get halfHeight() {
        return this.height / 2
    }

    get xVel() {
        return this._xVel
    }

    get yVel() {
        return this._yVel
    }

    set xVel(value: number) {
        this._xVel = value
    }

    set yVel(value: number) {
        this._yVel = value
    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }
}
