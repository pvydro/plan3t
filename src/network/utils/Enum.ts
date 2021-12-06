export enum PlayerBodyState {
    Idle = 0,
    Walking = 1
}

export enum PlayerLegsState {
    Standing = 0,
    Crouched = 1,
    Jumping = 2
}

export enum Direction {
    Left = -1,
    Right = 1
}

export enum CreatureType {
    // Passive
    Koini = 'Koini',
    PassiveHornet = 'PassiveHornet',

    // Enemies
    FlyingEye = 'FlyingEye',
    Sorm = 'Sorm',
    Nenj = 'Nenj'
}

export enum MapBuildingType {
    Dojo = 'dojo',
    Castle = 'castle',
    CloningFacility = 'cloningfacility',
    // ModernHome = 'modernhome',
    // Warehouse = 'warehouse'
}
