import { EnemyHelper, EnemyProperties } from './helper/EnemyHelper'
import { ITravelkinCreature, TravelkinCreature, TravelkinCreatureOptions } from '../creature/travelkin/TravelkinCreature'
import { Bullet } from '../weapon/projectile/Bullet'
import { TrackerPatherAI } from '../ai/trackerpather/TrackerPatherAI'
import { EnemyDebugger } from './EnemyDebugger'
import { DebugConstants } from '../utils/Constants'
import { camera, entityMan, particleMan } from '../shared/Dependencies'

export interface IEnemy extends ITravelkinCreature {
}

export interface EnemyOptions extends TravelkinCreatureOptions {
    name: string
}


export abstract class Enemy extends TravelkinCreature implements IEnemy {
    private debugger?: EnemyDebugger
    static EnemyIdIteration: number = 0

    constructor(options: EnemyOptions) {
        super(options)

        const enemyProperties = EnemyHelper.getPropertiesForEnemyType(this) // TODO: Remove this

        this.applyEnemyProperties(enemyProperties)
        this.entityId = 'Enemy' + Enemy.EnemyIdIteration++
        this.ai = new TrackerPatherAI({ gravityOrganism: this })
        this.name = options.name

        if (DebugConstants.ShowEnemyAttackRadius) {
            this.debugger = new EnemyDebugger({ enemy: this })

            this.addChildAt(this.debugger, 0)
        }
    }

    applyEnemyProperties(properties: EnemyProperties) {
        this.dimension = properties.dimension
    }

    takeDamage(damage: number) {
        if (this.isDead) return

        super.takeDamage(damage)

        const damageString = '-' + damage
        
        camera.shakeAndFlash(2.5)

        particleMan.addTextParticle({
            text: damageString,
            position: { x: this.x, y: this.y },
            positionRandomization: { randomizationRange: 32 }
        })
        particleMan.addBloodParticles({
            position: { x: this.x, y: this.y },
            positionRandomization: { randomizationRange: 8 }
        })
    }

    async die() {
        if (this.isDead) return

        particleMan.addDeathSkullParticle({
            position: { x: this.x, y: this.y },
            positionRandomization: { randomizationRange: 8 }
        })

        await super.die()

        const enemyManager = entityMan.enemyManager
        enemyManager.removeEnemy(this)
    }
}
