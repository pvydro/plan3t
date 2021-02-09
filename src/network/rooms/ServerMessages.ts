import { PlayerBodyState } from './Player'

export enum RoomMessage {
    NewPlanet = 'eNewPlanet',
    GetPlanet = 'eGetPlanet',
    PlayerBodyStateChanged = 'ePlayerBodyStateChanged',
    PlayerDirectionChanged = 'ePlayerDirectionChanged'
}

export enum ClientMessage {
    ServerHasPlanet = 'eServerHasPlanet',
    NeedNewPlanet = 'eNeedNewPlanet'
}


export interface NewPlanetMessagePayload {
    planet: any
}

// export interface PlayerBodyStateChangedPayload {
//     state: PlayerBodyState
// }

export interface PlayerPayload extends EntityPayload {
    direction: number
    bodyState: PlayerBodyState
}

export interface EntityPayload {
    x: number
    y: number
    xVel: number
    yVel: number
}
