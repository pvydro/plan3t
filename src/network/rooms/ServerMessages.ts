import { Direction, PlayerBodyState, PlayerLegsState } from '../utils/Enum'

export enum RoomMessage {
    RequestPlayer = 'r_request_player',
    NewChatMessage = 'r_new_chat',
    NewPlanet = 'r_new_planet',
    GetPlanet = 'r_get_planet',
    NewWaveRunner = 'r_new_wave_runner',
    PlayerUpdate = 'r_player_update',
    PlayerShoot = 'r_player_shoot',
    AIAction = 'r_ai_action'
}

export enum ClientMessage {
    ServerHasPlanet = 'c_server_has_planet',
    NeedNewPlanet = 'c_need_new_planet',
    UpdateChat = 'c_update_chat',
    AIAction = 'c_ai_action',

    WaveRunnerStarted = 'c_wave_runner_started'
}

export interface ChatMessagePayload {
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
    frozen: boolean
}

export interface EntityPayload {
    x: number
    y: number
    xVel: number
    yVel: number
    frozen: boolean
}
