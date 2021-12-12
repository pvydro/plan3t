import 'reflect-metadata'
import { IUserProfile, UserProfile } from '../userprofile/UserProfile'
import { container } from 'tsyringe'
import { IMusicPlayer, MusicPlayer } from '../music/MusicPlayer'
import { IMusicLoader, MusicLoader } from '../music/MusicLoader'
import { IGameStateManager, GameStateManager } from '../manager/gamestatemanager/GameStateManager'
import { IParticleManager, ParticleManager } from '../manager/particlemanager/ParticleManager'
import { IMatchMaker, MatchMaker } from '../matchmaker/MatchMaker'
import { IGameMapManager, GameMapManager } from '../manager/GameMapManager'
import { Camera } from '../camera/Camera'
import { IEntityManager, EntityManager } from '../manager/entitymanager/EntityManager'
import { IInGameHUD, InGameHUD } from '../ui/ingamehud/InGameHUD'
import { LoadingScreen } from '../ui/uiscreen/loadingscreen/LoadingScreen'
import { ITooltipManager, TooltipManager } from '../manager/TooltipManager'
import { IRoomStateManager, RoomStateManager } from '../manager/roommanager/RoomStateManager'

// Services
export const userProfile: IUserProfile = container.resolve(UserProfile)
export const musicLoader: IMusicLoader = container.resolve(MusicLoader)
export const musicPlayer: IMusicPlayer = container.resolve(MusicPlayer)
export const matchMaker: IMatchMaker = container.resolve(MatchMaker)

// Constant containers
export const camera: Camera = container.resolve(Camera)
export const inGameHUD: IInGameHUD = container.resolve(InGameHUD)
export const loadingScreen: LoadingScreen = container.resolve(LoadingScreen)

// Managers
export const gameStateMan: IGameStateManager = container.resolve(GameStateManager)
export const roomStateMan: IRoomStateManager = container.resolve(RoomStateManager)
export const gameMapMan: IGameMapManager = container.resolve(GameMapManager)
export const particleMan: IParticleManager = container.resolve(ParticleManager)
export const entityMan: IEntityManager = container.resolve(EntityManager)
export const toolTipMan: ITooltipManager = container.resolve(TooltipManager)
