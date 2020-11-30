import * as PIXI from 'pixi.js'
import { Assets, AssetUrls } from '../asset/Assets'
import { Entity } from '../network/rooms/Entity'
import { IContainer, Container } from '../utils/Container'
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
    sprite?: PIXI.Sprite
}

export class ClientEntity extends Container implements IClientEntity {
    sprite: PIXI.Sprite
    entity?: Entity
    x: number
    y: number
    type: EntityType

    constructor(options?: ClientEntityOptions) {
        super()

        this.entity = options.entity
        this.sprite = options.sprite ? options.sprite : new PIXI.Sprite(PIXI.Texture.from(Assets.get(AssetUrls.PLAYER_HEAD_ASTRO)))

        if (this.entity !== undefined) {
            this.position.set(this.entity.x, this.entity.y)
        }

        this.addChild(this.sprite)
    }

    set dimension(value: IDimension) {
        this.width = value.width
        this.height = value.height
    }
}
