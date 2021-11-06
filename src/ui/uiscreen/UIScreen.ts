import { Graphix } from '../../engine/display/Graphix'
import { log } from '../../service/Flogger'
import { GameWindow } from '../../utils/Constants'
import { UIDefaults } from '../../utils/Defaults'
import { exists } from '../../utils/Utils'
import { InGameScreenID } from '../ingamemenu/InGameMenu'
import { ISharedScreenBackground, SharedScreenBackground } from '../sharedbackground/SharedScreenBackground'
import { IUIComponent, UIComponent, UIComponentOptions } from '../UIComponent'
import { UIScreenHeader, UIScreenHeaderOptions } from './UIScreenHeader'
import { UIScreenShakeOptions, UIScreenShaker } from './UIScreenShaker'

export interface IUIScreen extends IUIComponent {
    backgroundGraphic?: Graphix
    sharedBackground?: ISharedScreenBackground
    applyScale(components?: any[]): void
    exit(): void
}

export interface UIScreenBackgroundOptions {
    backgroundColor?: number
    useSharedBackground?: boolean
}

export interface UIScreenOptions extends UIComponentOptions {
    background?: UIScreenBackgroundOptions
    shakeOptions?: UIScreenShakeOptions
    header?: UIScreenHeaderOptions
}

export class UIScreen extends UIComponent implements IUIScreen {
    backgroundGraphic?: Graphix
    sharedBackground?: ISharedScreenBackground
    screenHeader?: UIScreenHeader
    screenShaker?: UIScreenShaker

    constructor(options?: UIScreenOptions) {
        options = options ?? {}
        options.filters = options.filters === null ? []
            : (options.filters ?? UIDefaults.UIScreenDefaultFilters)
        super(options)

        if (options !== undefined) {
            if (exists(options.background)) {
                this.createBackgroundGraphics(options.background)
            }
            if (exists(options.header)) {
                this.createScreenHeader(options.header)
            }
            if (exists(options.shakeOptions)) {
                this.screenShaker = new UIScreenShaker(this, options.shakeOptions)
            }
        }
    }

    update() {
        if (this.sharedBackground) {
            this.sharedBackground.update()
        }
    }

    applyScale(components?: any[]) {
        if (components === undefined) components = []
        if (this.screenHeader) components.push(this.screenHeader)

        for (var i in components) {
            const scaledComponent = components[i]

            scaledComponent.scale.set(UIDefaults.UIScale, UIDefaults.UIScale)
        }
    }

    protected createBackgroundGraphics(options: UIScreenBackgroundOptions) {
        log('UIScreen', 'createBackgroundGraphics')

        if (options.useSharedBackground) {
            const sharedBackground = SharedScreenBackground.getInstance()

            this.sharedBackground = sharedBackground
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

    protected createScreenHeader(options: UIScreenHeaderOptions) {
        log('UIScreen', 'createScreenHeader')

        this.screenHeader = new UIScreenHeader(options)

        this.addChild(this.screenHeader)
    }

    reposition(addListener?: boolean) {
        super.reposition(addListener)

        if (this.backgroundGraphic !== undefined) {
            this.backgroundGraphic.width = GameWindow.width
            this.backgroundGraphic.height = GameWindow.height
        }
    }

    exit() {
        if (this.screenShaker) {
            this.screenShaker.stopShake()
        }
    }
}
