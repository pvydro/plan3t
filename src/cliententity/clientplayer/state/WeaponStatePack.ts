export interface WeaponStatePack {
    sessionId: string
    name: string
    rotation: number
    direction: number
}

export interface BulletStatePack {
    playerId: string
    bulletVelocity: number
    y: number
    x: number
    rotation: number
}
