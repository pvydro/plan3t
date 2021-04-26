import { InGameTooltipOptions, TooltipType } from '../ui/ingametooltip/InGameTooltip'
import { KeyTooltip } from '../ui/ingametooltip/KeyTooltip'

export interface IInGameTooltipFactory {
    createTooltip(options: InGameTooltipOptions)
}

export class InGameTooltipFactory implements IInGameTooltipFactory {
    constructor() {

    }

    createTooltip(options: InGameTooltipOptions) {
        let tooltip

        switch (options.type) {
            default:
            case TooltipType.Key:
                tooltip = new KeyTooltip(options)
                break
        }

        return tooltip
    }
}
