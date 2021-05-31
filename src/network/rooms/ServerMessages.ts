import { Direction, PlayerBodyState, PlayerLegsState } from '../utils/Enum'

export enum RoomMessage {
    NewPlanet = 'eNewPlanet',
    GetPlanet = 'eGetPlanet',
    PlayerBodyStateChanged = 'ePlayerBodyStateChanged',
    PlayerLegsStateChanged = 'ePlayerLegsStateChanged',
    PlayerConciousnessStateChanged = 'ePlayerConciousnessStateChanged',
    PlayerDirectionChanged = 'ePlayerDirectionChanged',
    PlayerLandedOnGround = 'ePlayerLandedOnGround',
    PlayerLookAngleChanged = 'ePlayerLookAngleChanged',
    PlayerShoot = 'ePlayerShoot'
}

export enum ClientMessage {
    ServerHasPlanet = 'eServerHasPlanet',
    NeedNewPlanet = 'eNeedNewPlanet'
}

export interface NewPlanetMessagePayload {
    planet: any
}

export interface PlayerPayload extends EntityPayload {
    weaponName: string
    direction: Direction
    walkingDirection: Direction
    bodyState: PlayerBodyState
    legsState: PlayerLegsState
    isOnGround: boolean
}

export interface WeaponStatusPayload {
    direction: Direction
    name: string
    rotation: number
    bulletX?: number
    bulletY?: number
    bulletVelocity?: number
}

export interface EntityPayload {
    x: number
    y: number
    xVel: number
    yVel: number
}
