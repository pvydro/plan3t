import { create } from 'colyseus/lib/MatchMaker'
import { Camera } from '../../camera/Camera'
import { CameraLayer } from '../../camera/CameraStage'
import { Creature, CreatureType } from '../../creature/Creature'
import { CreatureFactory, ICreatureFactory } from '../../factory/CreatureFactory'
import { IEntityManager } from './EntityManager'

export interface IEntityCreatureCreator {
    createCreature(options: CreatureCreationOptions): Creature
}

export interface CreatureCreationOptions {
    type: CreatureType
}

export interface EntityCreatureCreatorOptions {
    entityManager: IEntityManager
}

export class EntityCreatureCreator implements IEntityCreatureCreator {
    entityManager: IEntityManager
    creatureFactory: ICreatureFactory
    creatures: Map<string, Creature> = new Map()

    constructor(options: EntityCreatureCreatorOptions) {
        this.entityManager = options.entityManager
        this.creatureFactory = new CreatureFactory()
    }

    createCreature(options: CreatureCreationOptions) {
        const creature = this.creatureFactory.createCreatureForType(options.type)

        this.cameraStage.addChildAtLayer(creature, CameraLayer.Creatures)
        this.entityManager.registerEntity(creature.entityId, { clientEntity: creature })
        this.creatures.set(creature.entityId, creature)
        
        creature.x = 512 + (Math.random() * 128)
        creature.y = -64

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
