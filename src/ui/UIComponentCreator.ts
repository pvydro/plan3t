import { log } from '../service/Flogger'
import { exists } from '../utils/Utils'
import { IInGameHUD } from './ingamehud/InGameHUD'
import { IUIComponent, UIComponent } from './UIComponent'
import { IUIComponentFactory, UIComponentFactory } from './UIComponentFactory'

export enum UIComponentType {
    PauseButton = 'PauseButton',
}

export interface IUIComponentCreator {
    allComponents: IUIComponent[]
    getComponentForType(type: UIComponentType): UIComponent
    deleteComponentForType(type: UIComponentType): void
    componentExists(type: UIComponentType): boolean
}

export class UIComponentCreator implements IUIComponentCreator {
    factory: IUIComponentFactory
    hud: IInGameHUD
    componentMap: Map<UIComponentType, UIComponent>
    componentArray: IUIComponent[] = []

    constructor() {
        this.componentMap = new Map()
        this.factory = new UIComponentFactory()
    }

    getComponentForType(type: UIComponentType) {
        log('UIComponentCreator', 'getComponentForType', 'type', type)

        let component = this.componentMap.get(type)

        if (!component) {
            log('UIComponentCreator', 'Component not yet created, creating...')

            component = this.factory.createComponentForType(type)

            this.componentMap.set(type, component)
            this.updateInternalComponentsArray()
        }

        return component
    }

    deleteComponentForType(type: UIComponentType) {
        log('UIComponentCreator', 'deleteComponentForType', 'type', type)

        const component = this.componentMap.get(type)
        const componentIndex = this.componentArray.indexOf(component)
        
        component.demolish()
        this.componentMap.delete(type)

        delete this.componentArray[componentIndex]
    }

    componentExists(type: UIComponentType) {
        return exists(this.componentMap.get(type))
    }

    private updateInternalComponentsArray() {
        this.componentMap.forEach((component: IUIComponent) => {
            if (this.componentArray.indexOf(component) === -1) {
                this.componentArray.push(component)
            }
        })
    }

    get allComponents() {
        return this.componentArray
    }
}
