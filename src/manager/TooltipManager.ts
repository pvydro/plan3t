import { Container } from '../engine/display/Container'
import { IUpdatable } from '../interface/IUpdatable'
import { IInGameTooltip, InGameTooltip, InGameTooltipOptions } from '../ui/ingametooltip/InGameTooltip'
import { IInGameTooltipFactory, InGameTooltipFactory } from '../ui/ingametooltip/InGameTooltipFactory'

export interface ITooltipManager extends IUpdatable {

}

export class TooltipManager implements ITooltipManager {
    private static INSTANCE: TooltipManager
    container: Container
    factory: IInGameTooltipFactory
    tooltips: Set<IInGameTooltip>
    
    static getInstance() {
        if (TooltipManager.INSTANCE === undefined) {
            TooltipManager.INSTANCE = new TooltipManager()
        }

        return TooltipManager.INSTANCE
    }

    private constructor() {
        this.factory = new InGameTooltipFactory()
        this.container = new Container()
        this.tooltips = new Set()
    }

    update() {
        for (var t of this.tooltips.values()) {
            t.update()
        }
    }

    addTooltip(options: InGameTooltipOptions) {
        const tooltip = this.factory.createTooltip(options)

        this.container.addChild(tooltip)
        this.tooltips.add(tooltip)
    }

    removeTooltip(tooltip: InGameTooltip) {
        this.container.removeChild(tooltip)
        this.tooltips.delete(tooltip)
    }
}
