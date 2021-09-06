export interface IUserProfile {
    username: string
    rank: number
}

export class UserProfile implements IUserProfile {
    username: string = 'Guest'
    rank: number = 25
}
