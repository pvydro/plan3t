import { IEntityManager } from "./EntityManager";

export interface IEntitySynchronizer {

}

export interface EntitySynchronizerOptions {
    entityManager: IEntityManager
}

export class EntitySynchronizer implements IEntitySynchronizer {
    entityManager: IEntityManager

    constructor(options: EntitySynchronizerOptions) {
        this.entityManager = options.entityManager
    }
}
