import { create } from 'colyseus/lib/MatchMaker'
import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { Creature } from '../../creature/Creature'
import { CreatureType } from '../../creature/CreatureType'
import { CreatureFactory } from '../../factory/CreatureFactory'
import { EntityCreatorOptions, IEntityManager } from './EntityManager'

export interface IEntityCreatureCreator {
    createCreature(id: string, options: CreatureCreationOptions): Creature
}

export interface CreatureCreationOptions extends EntityCreatorOptions {
    type: CreatureType
}

export interface EntityCreatureCreatorOptions {
    entityManager: IEntityManager
}

export class EntityCreatureCreator implements IEntityCreatureCreator {
    entityManager: IEntityManager

    constructor(options: EntityCreatureCreatorOptions) {
        this.entityManager = options.entityManager
    }

    createCreature(id: string, options: CreatureCreationOptions) {
        const creature = CreatureFactory.createCreatureForType(options.type)

        creature.entityId = id
        creature.x = options.schema.x ?? 0
        creature.y = options.schema.y ?? 0

        this.cameraStage.addChildAtLayer(creature, CameraLayer.Creatures)
        this.entityManager.registerEntity(id, {
            clientEntity: creature,
            serverEntity: options.schema
        })

        return creature
    }

    get roomState() {
        return this.entityManager.roomState
    }

    get camera(): Camera {
        return this.entityManager.camera
    }

    get cameraStage() {
        return this.camera.stage
    }
}
