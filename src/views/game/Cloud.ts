import {getRandomNum} from '@/utils'
import imageSprite from './ImageSprite'
import {Sprite} from './types'

/**
 * 云朵
 * 没有碰撞体积的装饰物
 * @param {CanvasRenderingContext2D} canvasCtx 载入到实例的canvas2D上下文
 * @param {Sprite} sprite 实例的精灵信息
 * @param {Sprite} X 云朵的X坐标信息
 * @constructor
 */
export default class Cloud {
  /**
   * Cloud object config.
   * @enum {number}
   */
  static config = {
    HEIGHT: 14,
    MAX_CLOUD_GAP: 400,
    MAX_SKY_LEVEL: 30,
    MIN_CLOUD_GAP: 100,
    MIN_SKY_LEVEL: 71,
    WIDTH: 46
  }

  // 是否移除状态
  remove = false
  // 云间隙
  cloudGap = getRandomNum(Cloud.config.MIN_CLOUD_GAP, Cloud.config.MAX_CLOUD_GAP)

  // 基于容器坐标
  Y = getRandomNum(Cloud.config.MAX_SKY_LEVEL, Cloud.config.MIN_SKY_LEVEL)

  constructor(
    public canvasCtx: CanvasRenderingContext2D,
    public sprite: Sprite,
    public X: number
  ) {
    this.cloudGap = getRandomNum(Cloud.config.MIN_CLOUD_GAP, Cloud.config.MAX_CLOUD_GAP)
    this.draw()
  }
  /**
   * 绘制地面.
   */
  draw() {
    this.canvasCtx.save()
    this.canvasCtx.drawImage(
      imageSprite.image,
      this.sprite.X,
      this.sprite.Y,
      this.sprite.WIDTH,
      this.sprite.HEIGHT,
      this.X,
      this.Y,
      Cloud.config.WIDTH,
      Cloud.config.HEIGHT
    )
    this.canvasCtx.restore()
  }

  /**
   * 更新云朵的位置
   * @param speed
   */
  updateXPos(speed: number) {
    if (!this.remove) {
      this.X -= Math.ceil(speed)
      this.draw()
      // 检测是否超出画布
      this.isHide && (this.remove = true)
    } else {
      // 后续做销毁实例
    }
  }

  /**
   * 检测是否超出画布
   */
  get isHide() {
    return this.X < -Cloud.config.WIDTH
  }
}
