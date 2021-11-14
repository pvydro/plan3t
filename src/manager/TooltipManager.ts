import { Container } from '../engine/display/Container'
import { IUpdatable } from '../interface/IUpdatable'
import { IInGameTooltip, InGameTooltip, InGameTooltipOptions } from '../ui/ingametooltip/InGameTooltip'
import { IInGameTooltipFactory, InGameTooltipFactory } from '../factory/InGameTooltipFactory'

export interface ITooltipManager extends IUpdatable {
    container: Container
    addTooltip(options: InGameTooltipOptions): InGameTooltip
    removeTooltip(tooltip: InGameTooltip): void
}

export class TooltipManager implements ITooltipManager {
    container: Container
    factory: IInGameTooltipFactory
    tooltips: Set<IInGameTooltip>

    constructor() {
        this.factory = new InGameTooltipFactory()
        this.container = new Container()
        this.tooltips = new Set()
    }

    update() {
        for (var t of this.tooltips.values()) {
            t.update()
        }
    }

    addTooltip(options: InGameTooltipOptions): InGameTooltip {
        const tooltip = this.factory.createTooltip(options)

        this.container.addChild(tooltip)
        this.tooltips.add(tooltip)

        return tooltip
    }

    removeTooltip(tooltip: InGameTooltip) {
        this.container.removeChild(tooltip)
        this.tooltips.delete(tooltip)
    }
}
