import { EntitySchema } from '../network/schema/EntitySchema'
import { ISprite, Sprite } from '../engine/display/Sprite'
import { IContainer, Container } from '../engine/display/Container'
import { IDimension } from '../engine/math/Dimension'
import { IUpdatable } from '../interface/IUpdatable'
import { IVector2 } from '../engine/math/Vector2'
import { EntityFlashOptions, EntityFlashPlugin, IEntityFlashPlugin } from './plugins/EntityFlashPlugin'
import { EntityKnockbackOptions, EntityKnockbackPlugin, IEntityKnockbackPlugin } from './plugins/EntityKnockbackPlugin'
import { lerp } from '../utils/Math'

export interface IClientEntity extends IContainer, IUpdatable {
    x: number
    y: number
    halfWidth: number
    halfHeight: number
    xVel: number
    yVel: number
    type: string
    scale: IVector2
    position: IVector2
    targetServerPosition: IVector2
    targetServerDimension: IDimension
    entityId: string
    sprite: ISprite | IContainer
    frozen: boolean
    getAllSprites(): (Container | Sprite)[]
}

export enum EntityType {
    ClientPlayer = 'ClientPlayer',
    EnemyPlayer = 'EnemyPlayer',
    EnemyBall = 'EnemyBall',
    Bullet = 'Bullet'
}

export interface IClientEntityPluginOptions {
    addFlashPlugin?: boolean
    addKnockbackPlugin?: boolean
}

export interface IClientEntityPlugins {
    flashPlugin?: IEntityFlashPlugin
    knockbackPlugin?: IEntityKnockbackPlugin
}

export interface ClientEntityOptions {
    entity?: EntitySchema
    sprite?: Sprite | Container
    plugins?: IClientEntityPluginOptions
}

export class ClientEntity extends Container implements IClientEntity {
    static CurrentIDIteration: number = 0
    protected _xVel: number = 0
    protected _yVel: number = 0
    frozen: boolean = false
    _sprite: Sprite | Container
    name: string = 'ClientEntity'
    entityId: string
    entity?: EntitySchema
    x: number
    y: number
    targetServerPosition: IVector2 = { x: undefined, y: undefined }
    targetServerDimension: IDimension = { width: undefined, height: undefined }
    targetServerLerpRate: number = 0.2
    type: EntityType
    plugins: IClientEntityPlugins = {}

    constructor(options?: ClientEntityOptions) {
        super()

        if (options) {
            const entity = this
            
            this.entity = options.entity
            this._sprite = options.sprite

            // Plugins
            if (options.plugins) {
                if (options.plugins.addFlashPlugin) {
                    this.plugins.flashPlugin = new EntityFlashPlugin({ entity })
                }
                if (options.plugins.addKnockbackPlugin) {
                    this.plugins.knockbackPlugin = new EntityKnockbackPlugin({ entity })
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

        if (this.targetServerPosition.x !== undefined) {
            this.x = lerp(this.x, this.targetServerPosition.x, this.targetServerLerpRate)
        }
        if (this.targetServerPosition.y !== undefined) {
            this.y = lerp(this.y, this.targetServerPosition.y, this.targetServerLerpRate)
        }
    }

    flash(options?: EntityFlashOptions) {
        if (this.plugins.flashPlugin) {
            this.plugins.flashPlugin.flash(options)
        }
    }
    
    knockback(options?: EntityKnockbackOptions) {
        if (this.plugins.knockbackPlugin) {
            this.plugins.knockbackPlugin.knockback(options)
        }
    }

    getAllSprites(): (Container | Sprite)[] {
        return [ this.sprite ]
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

    get sprite() {
        return (this._sprite as Sprite)
    }
}
