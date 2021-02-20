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
    _nodesMagnetized: boolean = false
    magnetizeSpeed: number = 5
    crosshair: ICrosshair

    constructor(options: CrosshairCursorOptions) {
        this.crosshair = options.crosshair
    }

    update() {
        if (this._nodesMagnetized) {
            this.nodeTwo.x += (0 - this.nodeTwo.x) / this.magnetizeSpeed
            this.nodeThree.x += (0 - this.nodeThree.x) / this.magnetizeSpeed
        }
    }

    magnetizeNodes() {
        if (this._nodesMagnetized) return

        this._nodesMagnetized = true
    }

    demagnetizeNodes() {
        if (!this._nodesMagnetized) return
        
        this._nodesMagnetized = false
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
