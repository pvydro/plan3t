import 'reflect-metadata'
import { IUserProfile, UserProfile } from '../userprofile/UserProfile'
import { container } from 'tsyringe'
import { IMusicPlayer, MusicPlayer } from '../music/MusicPlayer'
import { IMusicLoader, MusicLoader } from '../music/MusicLoader'
import { IGameStateManager, GameStateManager } from '../manager/gamestatemanager/GameStateManager'
import { IParticleManager, ParticleManager } from '../manager/particlemanager/ParticleManager'
import { IMatchMaker, MatchMaker } from '../matchmaker/MatchMaker'
import { IGameMapManager, GameMapManager } from '../manager/GameMapManager'
import { Camera, ICamera } from '../camera/Camera'
import { IEntityManager, EntityManager } from '../manager/entitymanager/EntityManager'

export const camera: ICamera = container.resolve(Camera)
export const userProfile: IUserProfile = container.resolve(UserProfile)
export const musicLoader: IMusicLoader = container.resolve(MusicLoader)
export const musicPlayer: IMusicPlayer = container.resolve(MusicPlayer)
export const matchMaker: IMatchMaker = container.resolve(MatchMaker)

export const gameStateMan: IGameStateManager = container.resolve(GameStateManager)
export const gameMapMan: IGameMapManager = container.resolve(GameMapManager)
export const particleMan: IParticleManager = container.resolve(ParticleManager)
export const entityMan: IEntityManager = container.resolve(EntityManager)
