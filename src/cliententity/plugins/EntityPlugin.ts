import { IClientEntity } from '../ClientEntity'

export interface IEntityPlugin {

}

export interface EntityPluginOptions {
    entity: IClientEntity
}

export abstract class EntityPlugin implements IEntityPlugin {
    protected entity: IClientEntity

    constructor(options: EntityPluginOptions) {
        this.entity = options.entity
    }
}
