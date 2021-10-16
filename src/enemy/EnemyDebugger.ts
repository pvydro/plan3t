import { Container } from '../engine/display/Container'
import { Graphix } from '../engine/display/Graphix'
import { DebugConstants } from '../utils/Constants'
import { IEnemy } from './Enemy'

export interface IEnemyDebugger {

}

export interface EnemyDebuggerOptions {
    enemy: IEnemy
}

export class EnemyDebugger extends Container implements IEnemyDebugger {
    graphics: Graphix
    attackRadius: number
    color: number = 0xFF7F7F

    constructor(options: EnemyDebuggerOptions) {
        super()

        if (DebugConstants.ShowEnemyAttackRadius) {
            this.attackRadius = options.enemy.attackRadius
    
            this.graphics = new Graphix()
            this.graphics.beginFill(this.color)
            this.graphics.drawCircle(0, options.enemy.halfHeight, this.attackRadius)
            this.graphics.endFill()
            this.graphics.alpha = 0.2
    
            this.addChild(this.graphics)
        }
    }
}
