import { Entity } from '../network/rooms/Entity'
import { Sprite } from '../engine/display/Sprite'
import { IContainer, Container } from '../engine/display/Container'
import { IDimension } from '../engine/math/Dimension'
import { IUpdatable } from '../interface/IUpdatable'
import { IVector2 } from '../engine/math/Vector2'
import { EntityFlashOptions, EntityFlashPlugin, IEntityFlashPlugin } from './plugins/EntityFlashPlugin'
import { log } from '../service/Flogger'

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

export interface IClientEntityPluginOptions {
    addFlashPlugin?: boolean
    addKnockbackPlugin?: boolean   // TODO
}

export interface IClientEntityPlugins {
    flashPlugin?: IEntityFlashPlugin
}

export interface ClientEntityOptions {
    entity?: Entity
    sprite?: Sprite
    plugins?: IClientEntityPluginOptions
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
    plugins: IClientEntityPlugins = {}
    name: string = 'ClientEntity'

    constructor(options?: ClientEntityOptions) {
        super()

        if (options) {
            this.entity = options.entity
            this.sprite = options.sprite
            const entity = this

            if (options.plugins) {
                if (options.plugins.addFlashPlugin) {
                    this.plugins.flashPlugin = new EntityFlashPlugin({ entity })
                } else if (options.plugins.addKnockbackPlugin) {
                    // TODO: This
                }
            }
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
        if (this.plugins.flashPlugin) this.plugins.flashPlugin.update()
    }

    flash(options?: EntityFlashOptions) {
        options = options ?? { maximumBrightness: 1, randomize: false }

        this.plugins.flashPlugin.flash(options)
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
