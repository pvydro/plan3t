import { Graphix } from '../../engine/display/Graphix'
import { log } from '../../service/Flogger'
import { GameWindow } from '../../utils/Constants'
import { UIDefaults } from '../../utils/Defaults'
import { exists } from '../../utils/Utils'
import { SharedScreenBackground } from '../sharedbackground/SharedScreenBackground'
import { IUIComponent, UIComponent, UIComponentOptions } from '../UIComponent'
import { IUIComponentCreator, UIComponentCreator } from '../UIComponentCreator'

export interface IUIScreen extends IUIComponent {
    backgroundGraphic?: Graphix
    applyScale(components?: any[]): void
}

export interface UIScreenBackgroundOptions {
    backgroundColor?: number
    useSharedBackground?: boolean
}
export interface UIScreenOptions extends UIComponentOptions {
    background?: UIScreenBackgroundOptions
}

export class UIScreen extends UIComponent implements IUIScreen {
    backgroundGraphic?: Graphix

    constructor(options?: UIScreenOptions) {
        options = options ?? {}
        options.filters = options.filters === null ? []
            : (options.filters ?? UIDefaults.UIScreenDefaultFilters)
        super(options)

        if (options !== undefined) {
            if (exists(options.background)) {
                this.createBackgroundGraphics(options.background)
            }
        }
    }

    applyScale(components?: any[]) {
        if (components !== undefined) {

            for (var i in components) {
                const scaledComponent = components[i]

                scaledComponent.scale.set(UIDefaults.UIScale, UIDefaults.UIScale)
            }
        }
    }

    protected createBackgroundGraphics(options: UIScreenBackgroundOptions) {
        log('UIScreen', 'createBackgroundGraphics')

        if (options.useSharedBackground) {
            const sharedBackground = SharedScreenBackground.getInstance()

            this.addChild(sharedBackground)
        } else {
            const backgroundColor = options.backgroundColor ?? 0x000000
            const width = GameWindow.width
            const height = GameWindow.height
    
            if (this.backgroundGraphic !== undefined) {
                this.backgroundGraphic.demolish()
            }
    
            this.backgroundGraphic = new Graphix()
            this.backgroundGraphic.beginFill(backgroundColor)
            this.backgroundGraphic.drawRect(0, 0, width, height)
            this.backgroundGraphic.y = GameWindow.y
    
            this.addChild(this.backgroundGraphic)
        }
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        if (this.backgroundGraphic !== undefined) {
            this.backgroundGraphic.width = GameWindow.width
            this.backgroundGraphic.height = GameWindow.height
        }
    }
}
