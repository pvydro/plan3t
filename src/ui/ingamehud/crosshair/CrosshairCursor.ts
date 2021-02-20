import { IUpdatable } from '../../../interface/IUpdatable'
import { ICrosshair } from './Crosshair'

export interface ICrosshairCursor extends IUpdatable {
    magnetizeNodes(): void
    demagnetizeNodes(): void
}

export interface CrosshairCursorOptions {
    crosshair: ICrosshair
}

export class CrosshairCursor implements ICrosshairCursor {
    manipulationValues: any = {
        magnetizeDivisor: 5,
        rotationDivisor: 10,
        nodeOne: {
            x: 3.7, y: 4, rotation: -25 * (Math.PI / 180)
        },
        nodeTwo: {
            x: 0, rotation: -5 * (Math.PI / 180)
        },
        nodeThree: {
            x: 0, rotation: -60 * (Math.PI / 180),
            height: 5.55, skewX: -0.1
        }
    }
    _nodesMagnetized: boolean = false
    crosshair: ICrosshair

    constructor(options: CrosshairCursorOptions) {
        this.crosshair = options.crosshair
    }

    update() {
        if (this._nodesMagnetized) {
            const values = this.manipulationValues
            const magnetizeDivisor = values.magnetizeDivisor
            const rotationDivisor = values.rotationDivisor
            const nodeOneTarget = values.nodeOne
            const nodeTwoTarget = values.nodeTwo
            const nodeThreeTarget = values.nodeThree

            // Position
            this.nodeOne.x += (nodeOneTarget.x - this.nodeOne.x) / magnetizeDivisor
            this.nodeOne.y += (nodeOneTarget.y - this.nodeOne.y) / magnetizeDivisor
            this.nodeTwo.x += (nodeTwoTarget.x - this.nodeTwo.x) / magnetizeDivisor
            this.nodeThree.x += (nodeThreeTarget.x - this.nodeThree.x) / magnetizeDivisor
            this.nodeThree.height += (nodeThreeTarget.height - this.nodeThree.height) / magnetizeDivisor
            this.nodeThree.skew.x += (nodeThreeTarget.skewX - this.nodeThree.skew.x) / magnetizeDivisor

            // Rotation
            this.nodeOne.rotation += (nodeOneTarget.rotation - this.nodeOne.rotation) / rotationDivisor
            this.nodeTwo.rotation += (nodeTwoTarget.rotation - this.nodeTwo.rotation) / rotationDivisor
            this.nodeThree.rotation += (nodeThreeTarget.rotation - this.nodeThree.rotation) / rotationDivisor
        }
    }

    magnetizeNodes() {
        if (this._nodesMagnetized) {
            return
        } else {
            // First magnetize
            this.expandTriangle()
        }

        this._nodesMagnetized = true
    }

    demagnetizeNodes() {
        if (!this._nodesMagnetized) return
        
        this._nodesMagnetized = false
    }

    expandTriangle() {
        if (this._nodesMagnetized) return

        // this.nodeThree.pivot.set(0, 0)
        // this.nodeThree.rotation = 65
    }

    get nodesMagnetized() {
        return this._nodesMagnetized
    }

    get nodeOne() {
        return this.crosshair.nodeOne
    }

    get nodeTwo() {
        return this.crosshair.nodeTwo
    }

    get nodeThree() {
        return this.crosshair.nodeThree
    }

    get nodes() {
        return this.crosshair.nodes
    }
}
