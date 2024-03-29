import { log } from '../service/Flogger'
import { InGameChat } from './ingamechat/InGameChat'
import { AmmoStatusComponent } from './ingamehud/ammostatus/AmmoStatusComponent'
import { HealthBar } from './ingamehud/healthbar/HealthBar'
import { NextWaveSplash } from './ingamehud/nextwavesplash/NextWaveSplash'
import { PauseButton } from './ingamehud/pausebutton/PauseButton'
import { WaveRunnerCounter } from './ingamehud/waverunnercounter/WaveRunnerCounter'
import { UIComponent } from './UIComponent'

export enum UIComponentType {
    HUDPauseButton = 'HUDPauseButton',
    HUDAmmoStatus = 'HUDAmmoStatus',
    HUDWaveCounter = 'HUDWaveCounter',
    HUDHealthBar = 'HUDHealthBar',
    NextWaveSplash = 'NextWaveSplash',
    InGameChat = 'InGameChat'
}

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
            case UIComponentType.HUDWaveCounter:
                uicomponent = new WaveRunnerCounter()
                break
            case UIComponentType.HUDHealthBar:
                uicomponent = new HealthBar()
                break
            case UIComponentType.NextWaveSplash:
                uicomponent = new NextWaveSplash()
                break
            case UIComponentType.InGameChat:
                uicomponent = InGameChat.getInstance()
                break
        }

        return uicomponent
    }
}
