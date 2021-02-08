import { PlayerBodyState } from './Player'

export enum RoomMessage {
    NewPlanet = 'newPlanet',
    GetPlanet = 'getPlanet',
    PlayerBodyStateChanged = 'playerBodyStateChanged'
}

export enum ClientMessage {
    ServerHasPlanet = 'serverHasPlanet',
    NeedNewPlanet = 'needNewPlanet'
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
