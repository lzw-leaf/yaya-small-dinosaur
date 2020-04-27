import imageSprite from './ImageSprite'
import { getRandomNum } from '@/utils'
import { Sprite, ObstacleType } from '../types'
import Game from '..'
import runTime from '@/utils/runTime'
import CollisionBox from '../role/CollisionBox'

/**
 * 障碍物
 * @param canvasCtx //画布上下文
 * @constructor
 */
export default class Obstacle {
  // 障碍物的精灵图信息
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
    PTERODACTYL_MIN_GAD: 250,
    PTERODACTYL_FREQUENCY: 500
  }
  // 仙人掌两种基于精灵转换的体积模式
  static cactusVolumeList = [0.6, 1]

  // 当前使用的精灵数据
  sprite: Sprite
  currentSpriteIndex = 0

  // 实际画布的数据
  dimensions = { width: 0, height: 0 }
  X = Game.config.CANVAS_WIDTH
  Y = 0
  gap: number

  // 是否仙人掌（用于区分翼龙）
  isCactus = false
  // 积累时间
  cumulativeTime = 0

  // 碰撞盒子的基本信息
  readonly kindCollisionBoxMap = {
    CACTUS_SINGLE: [
      { XScale: 1, YScale: 206 - 182, width: 14, height: 38 },
      { XScale: 48 - 32, YScale: 1, width: 18, height: 94 },
      { XScale: 68 - 32, YScale: 202 - 182, width: 14, height: 40 }
    ],
    CACTUS_DOUBLE: [
      { XScale: 1, YScale: 206 - 182, width: 14, height: 38 },
      { XScale: 48 - 30, YScale: 1, width: 15, height: 94 },
      { XScale: 66 - 30, YScale: 192 - 182, width: 30, height: 50 },
      { XScale: 98 - 30, YScale: 1, width: 15, height: 94 },
      { XScale: 116 - 30, YScale: 202 - 182, width: 14, height: 41 }
    ],
    CACTUS_THREE: [
      { XScale: 1, YScale: 206 - 182, width: 14, height: 38 },
      { XScale: 48 - 32, YScale: 1, width: 15, height: 94 },
      { XScale: 66 - 32, YScale: 200 - 182, width: 30, height: 46 },
      { XScale: 98 - 32, YScale: 1, width: 15, height: 94 },
      { XScale: 120 - 32, YScale: 192 - 182, width: 26, height: 50 },
      { XScale: 148 - 32, YScale: 1, width: 16, height: 94 },
      { XScale: 168 - 32, YScale: 202 - 182, width: 14, height: 46 }
    ],
    CACTUS_FOUR: [
      { XScale: 1, YScale: 206 - 182, width: 14, height: 38 },
      { XScale: 48 - 32, YScale: 1, width: 15, height: 94 },
      { XScale: 66 - 32, YScale: 200 - 182, width: 30, height: 46 },
      { XScale: 98 - 32, YScale: 1, width: 15, height: 94 },
      { XScale: 120 - 32, YScale: 192 - 182, width: 26, height: 50 },
      { XScale: 148 - 32, YScale: 1, width: 16, height: 94 },
      { XScale: 168 - 32, YScale: 202 - 182, width: 14, height: 46 }
    ],
    PTERODACTYL: [
      [
        { XScale: 0, YScale: 230 - 212, width: 6, height: 10 },
        { XScale: 40 - 32, YScale: 220 - 212, width: 8, height: 20 },
        { XScale: 49 - 32, YScale: 0, width: 14, height: 24 },
        { XScale: 63 - 32, YScale: 230 - 212, width: 16, height: 48 },
        { XScale: 80 - 32, YScale: 230 - 212, width: 40, height: 30 }
      ],
      [
        { XScale: 0, YScale: 250 - 212 - 2, width: 6, height: 10 },
        { XScale: 40 - 32, YScale: 240 - 212 - 2, width: 8, height: 20 },
        { XScale: 49 - 32, YScale: 234 - 212 - 2, width: 10, height: 24 },
        { XScale: 60 - 32, YScale: 224 - 212 - 2, width: 8, height: 56 },
        { XScale: 68 - 32, YScale: 224 - 212 - 2, width: 10, height: 56 },
        { XScale: 78 - 32, YScale: 240 - 212, width: 14, height: 40 },
        { XScale: 93 - 32, YScale: 258 - 212 - 2, width: 30, height: 20 }
      ]
    ]
  }
  collisionBoxs: CollisionBox[]

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

    // 体积控制
    let coefficient = Obstacle.cactusVolumeList[Math.round(Math.random())]

    // 约束初期大小
    Game.currentSpeed < 10 &&
      ['CACTUS_FOUR', 'CACTUS_THREE'].includes(kindType) &&
      (coefficient = 0.6)

    if (this.isCactus) {
      this.dimensions.height *= coefficient
      this.dimensions.width *= coefficient
      this.Y =
        Game.config.CANVAS_HEIGHT - this.dimensions.height - Obstacle.config.FOOT_SINK
    } else {
      this.Y = getRandomNum(Obstacle.config.MAX_SKY_LEVEL, Obstacle.config.MIN_SKY_LEVEL)
    }

    this.gap = this.getGap()
    this.gap > Game.config.CANVAS_WIDTH && (this.gap = Game.config.CANVAS_WIDTH)
    this.collisionBoxs = this.setCollisionBoxs(kindType, coefficient)
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
    if (!this.isCactus) {
      this.cumulativeTime += deltaTime
      if (this.cumulativeTime - Obstacle.config.PTERODACTYL_FREQUENCY > 0) {
        this.cumulativeTime = 0
        this.currentSpriteIndex = this.currentSpriteIndex ? 0 : 1
        this.sprite = Obstacle.kindSpriteMap['PTERODACTYL'][this.currentSpriteIndex]
        this.collisionBoxs = this.setCollisionBoxs('PTERODACTYL', 1)
      }
    }
    const oldX = this.X
    const oldY = this.Y
    const increment = Math.floor(
      Game.currentSpeed * (runTime.getFPS() / 1000) * deltaTime
    )
    if (!this.isHide) {
      this.X -= increment
      this.draw()
      this.collisionBoxs.forEach(box =>
        box.setPosition(box.X + this.X - oldX, box.Y + this.Y - oldY)
      )
    }
  }

  setCollisionBoxs(kindType: ObstacleType, coefficient: number) {
    const collsionConfigList =
      kindType === 'PTERODACTYL'
        ? this.kindCollisionBoxMap[kindType][this.currentSpriteIndex]
        : this.kindCollisionBoxMap[kindType]
    return collsionConfigList.map(item => {
      return new CollisionBox(
        this.X + Math.ceil(item.XScale * coefficient),
        this.Y + Math.ceil(item.YScale * coefficient),
        Math.ceil(item.width * coefficient),
        Math.ceil(item.height * coefficient)
      )
    })
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
