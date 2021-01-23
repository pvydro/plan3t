import { Container } from '../../engine/display/Container'
import { Graphix } from '../../engine/display/Graphix'
import { IVector2, Vector2 } from '../../engine/math/Vector2'
import { InputProcessor } from '../../input/InputProcessor'
import { IUpdatable } from '../../interface/IUpdatable'

export interface ICrosshair extends IUpdatable {

}

export enum CrosshairState {
    Gameplay
}

export class Crosshair extends Container implements ICrosshair {
    private static INSTANCE: Crosshair
    mousePos: IVector2 = Vector2.Zero
    state: CrosshairState = CrosshairState.Gameplay

    nodeOne: Graphix = this.constructNode()
    nodeTwo: Graphix = this.constructNode()
    nodeThree: Graphix = this.constructNode()
    nodes: Graphix[] = [ this.nodeOne, this.nodeTwo, this.nodeThree ]
    
    static getInstance() {
        if (Crosshair.INSTANCE === undefined) {
            Crosshair.INSTANCE = new Crosshair()
        }
        return Crosshair.INSTANCE
    }

    private constructor() {
        super()

        for (var i in this.nodes) {
            const node = this.nodes[i]
            this.addChild(node)
        }

        this.styleNodes()
        this.followMouse()
    }

    followMouse() {
        InputProcessor.on('mousemove', (ev) => {
            this.mousePos.x = ev.clientX
            this.mousePos.y = ev.clientY
        })
    }

    update() {
        this.x = this.mousePos.x
        this.y = this.mousePos.y
    }
    
    growWithMouseDistance() {
        // TODO: This
    }

    constructNode(): Graphix {
        const graphics = new Graphix()

        graphics.beginFill(0xffffff)
        graphics.drawRect(0, 0, 1, 1)
        graphics.endFill()

        return graphics
    }

    styleNodes() {
        switch (this.state) {
            case CrosshairState.Gameplay:

                this.nodeTwo.x = -3
                this.nodeTwo.y = -2
                this.nodeTwo.height = 5

                this.nodeThree.x = 3
                this.nodeThree.y = -2
                this.nodeThree.height = 5

                break
        }

        this.scale.set(5, 5)
    }
}
