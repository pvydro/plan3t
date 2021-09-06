import { IUserProfile, UserProfile } from '../userprofile/UserProfile'
import { container } from 'tsyringe'

export const userProfile: IUserProfile = container.resolve(UserProfile)
