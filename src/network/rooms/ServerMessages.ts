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

export interface PlayerBodyStateChangedPayload {
    state: number
}
