import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../asset/Assets'
import { Entity } from '../network/rooms/Entity'
import { Sprite } from '../display/Sprite'
import { IContainer, Container } from '../display/Container'
import { IDimension, Dimension } from '../math/Dimension'

export interface IClientEntity extends IContainer {
    x: number
    y: number
    type: string
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

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }
}
