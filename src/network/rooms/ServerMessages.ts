import { Direction, PlayerBodyState, PlayerLegsState } from '../utils/Enum'

export enum RoomMessage {
    NewPlanet = 'eNewPlanet',
    GetPlanet = 'eGetPlanet',
    PlayerBodyStateChanged = 'ePlayerBodyStateChanged',
    PlayerLegsStateChanged = 'ePlayerLegsStateChanged',
    PlayerDirectionChanged = 'ePlayerDirectionChanged',
    PlayerLandedOnGround = 'ePlayerLandedOnGround'
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
    legsState: PlayerLegsState
}

export interface EntityPayload {
    x: number
    y: number
    xVel: number
    yVel: number
}
