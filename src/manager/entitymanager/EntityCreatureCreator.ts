import { IEntityManager } from './EntityManager'

export interface IEntityCreatureCreator {
    createCreature(options: CreatureCreationOptions): void
}

export interface CreatureCreationOptions {

}

export interface EntityCreatureCreatorOptions {
    entityManager: IEntityManager
}

export class EntityCreatureCreator implements IEntityCreatureCreator {
    entityManager: IEntityManager

    constructor(options: EntityCreatureCreatorOptions) {
        this.entityManager = options.entityManager
    }

    createCreature(options: CreatureCreationOptions) {

    }
}
