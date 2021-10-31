export enum AIAction {
    Attack = 'Attack',
    GoToNode = 'GoToNode',
    Stop = 'Stop',
    SetDirection = 'SetDirection',
}

export interface AIActionData {
    [ key: string ]: any
}

export interface AIActionPayload {
    action: AIAction
    data: AIActionData
}
