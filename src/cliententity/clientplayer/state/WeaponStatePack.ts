export interface WeaponStatePack {
    sessionId: string
    name: string
    rotation: number
    direction: number
    bulletVelocity?: number
    bulletX?: number
    bulletY?: number
    shouldShoot?: boolean
}
