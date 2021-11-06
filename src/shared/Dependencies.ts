import { IUserProfile, UserProfile } from '../userprofile/UserProfile'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { IMusicPlayer, MusicPlayer } from '../music/MusicPlayer'
import { IMusicLoader, MusicLoader } from '../music/MusicLoader'
import { IGameStateManager, GameStateManager } from '../manager/gamestatemanager/GameStateManager'
import { IParticleManager, ParticleManager } from '../manager/particlemanager/ParticleManager'

export const userProfile: IUserProfile = container.resolve(UserProfile)
export const musicLoader: IMusicLoader = container.resolve(MusicLoader)
export const musicPlayer: IMusicPlayer = container.resolve(MusicPlayer)

export const gameStateMan: IGameStateManager = container.resolve(GameStateManager)
export const particleMan: IParticleManager = container.resolve(ParticleManager)
