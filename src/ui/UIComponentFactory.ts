import { log } from '../service/Flogger'
import { AmmoStatusComponent } from './ingamehud/ammostatus/AmmoStatusComponent'
import { PauseButton } from './ingamehud/pausebutton/PauseButton'
import { UIComponent } from './UIComponent'
import { UIComponentType } from './UIComponentCreator'

export interface IUIComponentFactory {
    createComponentForType(type: UIComponentType): UIComponent
}

export class UIComponentFactory {
    constructor() {

    }

    createComponentForType(type: UIComponentType) {
        log('UIComponentFactory', 'createComponentForType', 'type', type)

        let uicomponent

        switch (type) {
            case UIComponentType.HUDPauseButton:
                uicomponent = new PauseButton()
                break
            case UIComponentType.HUDAmmoStatus:
                uicomponent = new AmmoStatusComponent()
                break
        }

        return uicomponent
    }
}
