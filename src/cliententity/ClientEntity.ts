import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../asset/Assets'
import { Entity } from '../network/rooms/Entity'
import { Sprite } from '../engine/display/Sprite'
import { IContainer, Container } from '../engine/display/Container'
import { IDimension, Dimension } from '../engine/math/Dimension'

export interface IClientEntity extends IContainer {
    x: number
    y: number
    xVel: number
    yVel: number
    type: string

    update(): void
}

export enum EntityType {
    ClientPlayer = 'ClientPlayer',
    EnemyPlayer = 'EnemyPlayer',
    EnemyBall = 'EnemyBall'
    // NPC_... = 'NPC_...'
}

export interface ClientEntityOptions {
    entity?: Entity
    sprite?: Sprite
}

export class ClientEntity extends Container implements IClientEntity {
    sprite: Sprite
    entity?: Entity
    x: number
    y: number
    xVel: number = 0
    yVel: number = 0
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
    }

    update() {

    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }
}
