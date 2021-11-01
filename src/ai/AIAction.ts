import { IVector2 } from '../engine/math/Vector2'

export enum AIAction {
    Attack = 'Attack',
    GoToNode = 'GoToNode',
    Stop = 'Stop',
    SetDirection = 'SetDirection',
    Die = 'Die'
}

export interface AIActionData {
    entityID: string
    currentNode?: IVector2
    [ key: string ]: any
}

export interface AIActionPayload {
    action: AIAction
    actionData: AIActionData
}
