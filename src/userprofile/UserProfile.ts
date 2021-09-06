export interface IUserProfile {
    username: string
    rank: number
}

export class UserProfile implements IUserProfile {
    username: string = 'Paydro'
    rank: number = 25
}
