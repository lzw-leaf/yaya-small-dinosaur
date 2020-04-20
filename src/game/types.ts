export type Sprite = { X: number; Y: number; WIDTH: number; HEIGHT: number }
export type GameStatus = 'WAITING' | 'BOOTING' | 'PLAYING' | 'CRASHED'
export type TrexStatus = 'WAITING' | 'RUNNING' | 'JUMPING' | 'DUCKING' | 'CRASHED'

// 障碍物类型
export type ObstacleType =
  | 'CACTUS_SINGLE'
  | 'CACTUS_DOUBLE'
  | 'CACTUS_THREE'
  | 'CACTUS_FOUR'
  | 'PTERODACTYL'
