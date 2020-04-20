import imageSprite from './ImageSprite'
import { getRandomNum } from '@/utils'
import { Sprite, ObstacleType } from '../types'
import Game from '..'
import runTime from '@/utils/runTime'

/**
 * 障碍物
 * @param canvasCtx //画布上下文
 * @constructor
 */
export default class Obstacle {
  // 障碍物的种类配置
  static kindSpriteMap = {
    CACTUS_SINGLE: [{ X: 650, Y: 2, WIDTH: 52, HEIGHT: 100 }],
    CACTUS_DOUBLE: [{ X: 702, Y: 2, WIDTH: 100, HEIGHT: 100 }],
    CACTUS_THREE: [{ X: 650, Y: 2, WIDTH: 152, HEIGHT: 100 }],
    CACTUS_FOUR: [{ X: 802, Y: 2, WIDTH: 150, HEIGHT: 100 }],
    PTERODACTYL: [
      { X: 260, Y: 14, WIDTH: 92, HEIGHT: 68 },
      { X: 352, Y: 2, WIDTH: 92, HEIGHT: 60 }
    ]
  }
  /**
   * 障碍物基本配置
   * @enum {number}
   */
  static config = {
    FOOT_SINK: 20,
    MAX_SKY_LEVEL: 0,
    MIN_SKY_LEVEL: 120,
    MAX_GAP_COEFFICIENT: 1.5,
    MIN_GAP_COEFFICIENT: 0.6,
    CACUTS_MIN_GAD: 200,
    PTERODACTYL_MIN_GAD: 250
  }
  // 仙人掌两种基于精灵转换的体积模式
  static cactusVolumeList = [0.6, 1]

  // 当前使用的精灵数据
  sprite: Sprite

  // 实际画布的数据
  dimensions = { width: 0, height: 0 }
  X = Game.config.CANVAS_WIDTH
  Y = 0
  gap: number

  isCactus = false

  constructor(public canvasCtx: CanvasRenderingContext2D) {
    const kindTypeList: ObstacleType[] = [
      'CACTUS_SINGLE',
      'CACTUS_DOUBLE',
      'CACTUS_THREE',
      'CACTUS_FOUR',
      'PTERODACTYL'
    ]
    const kindType = kindTypeList[getRandomNum(0, 4)]
    this.sprite = Obstacle.kindSpriteMap[kindType][0]
    this.dimensions.height = this.sprite.HEIGHT
    this.dimensions.width = this.sprite.WIDTH
    this.isCactus = kindType.startsWith('CACTUS')
    if (this.isCactus) {
      const coefficient = Obstacle.cactusVolumeList[Math.round(Math.random())]
      this.dimensions.height *= coefficient
      this.dimensions.width *= coefficient
      this.Y =
        Game.config.CANVAS_HEIGHT - this.dimensions.height - Obstacle.config.FOOT_SINK
    } else {
      this.Y = getRandomNum(Obstacle.config.MAX_SKY_LEVEL, Obstacle.config.MIN_SKY_LEVEL)
    }

    this.gap = this.getGap()
    this.gap > Game.config.CANVAS_WIDTH && (this.gap = Game.config.CANVAS_WIDTH)
  }
  /**
   * 绘制地面
   */
  draw() {
    this.canvasCtx.drawImage(
      imageSprite.image,
      this.sprite.X,
      this.sprite.Y,
      this.sprite.WIDTH,
      this.sprite.HEIGHT,
      this.X,
      this.Y,
      this.dimensions.width,
      this.dimensions.height
    )
  }

  /**
   * 更新障碍物的位置
   * @param speed
   */
  update(deltaTime: number) {
    const increment = Math.floor(
      Game.currentSpeed * (runTime.getFPS() / 1000) * deltaTime
    )
    if (!this.isHide) {
      this.X -= increment
      this.draw()
    }
  }
  /**
   * 随机获得距离下一个障碍物的间距
   */
  getGap() {
    const {
      CACUTS_MIN_GAD,
      PTERODACTYL_MIN_GAD,
      MIN_GAP_COEFFICIENT,
      MAX_GAP_COEFFICIENT
    } = Obstacle.config
    const initMinGap = this.isCactus ? CACUTS_MIN_GAD : PTERODACTYL_MIN_GAD
    const minGap = Math.round(
      this.dimensions.width * 0.5 * Game.currentSpeed + initMinGap * MIN_GAP_COEFFICIENT
    )
    const maxGap = Math.round(minGap * MAX_GAP_COEFFICIENT)
    return getRandomNum(minGap, maxGap)
  }
  /**
   * 检测是否超出画布
   */
  get isHide() {
    return this.X < -this.dimensions.width
  }
}
