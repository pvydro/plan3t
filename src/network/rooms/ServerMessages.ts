import { Direction, PlayerBodyState } from '../utils/Enum'

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

export interface PlayerPayload extends EntityPayload {
    direction: Direction
    walkingDirection: Direction
    bodyState: PlayerBodyState
}

export interface EntityPayload {
    x: number
    y: number
    xVel: number
    yVel: number
}
