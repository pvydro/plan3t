import { Direction, PlayerBodyState, PlayerLegsState } from '../utils/Enum'

export enum RoomMessage {
    NewChatMessage = 'r_new_chat',
    NewPlanet = 'r_new_planet',
    GetPlanet = 'r_get_planet',
    NewWaveRunner = 'r_new_wave_runner',
    PlayerBodyStateChanged = 'r_player_body_state_changed',
    PlayerLegsStateChanged = 'r_player_legs_state_changed',
    PlayerConciousnessStateChanged = 'r_player_conciousness_state_changed',
    PlayerDirectionChanged = 'r_player_direction_changed',
    PlayerLandedOnGround = 'r_player_landed_on_ground',
    PlayerLookAngleChanged = 'r_player_look_angle_changed',
    PlayerShoot = 'r_player_shoot',
    PlayerForceSetPosition = 'r_player_force_set_position'
}

export enum ClientMessage {
    ServerHasPlanet = 'c_server_has_planet',
    NeedNewPlanet = 'c_need_new_planet',
    UpdateChat = 'c_update_chat'
}

export interface NewChatMessagePayload {
    sender: string
    text: string
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
