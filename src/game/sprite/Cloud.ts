import { getRandomNum } from '@/utils'
import imageSprite from './ImageSprite'
import { Sprite } from '../types'
import Game from '..'

/**
 * 云朵
 * 没有碰撞体积的装饰物
 * @param {CanvasRenderingContext2D} canvasCtx 载入到实例的canvas2D上下文
 * @constructor
 */
export default class Cloud {
  // 云朵的精灵图位置
  static sprite: Sprite = { X: 164, Y: 2, WIDTH: 96, HEIGHT: 28 }
  /**
   * 云朵基本配置
   * @enum {number}
   */
  static config = {
    MAX_CLOUD_GAP: 800,
    MAX_SKY_LEVEL: 60,
    MIN_CLOUD_GAP: 200,
    MIN_SKY_LEVEL: 142
  }

  // 是否移除状态
  remove = false
  // 当前云与下一朵云的间隙
  cloudGap = getRandomNum(Cloud.config.MIN_CLOUD_GAP, Cloud.config.MAX_CLOUD_GAP)

  // 基于容器坐标
  X = Game.config.CANVAS_WIDTH
  Y = getRandomNum(Cloud.config.MAX_SKY_LEVEL, Cloud.config.MIN_SKY_LEVEL)

  constructor(public canvasCtx: CanvasRenderingContext2D) {
    this.cloudGap = getRandomNum(Cloud.config.MIN_CLOUD_GAP, Cloud.config.MAX_CLOUD_GAP)
    this.draw()
  }
  /**
   * 绘制地面
   */
  draw() {
    this.canvasCtx.save()
    this.canvasCtx.drawImage(
      imageSprite.image,
      Cloud.sprite.X,
      Cloud.sprite.Y,
      Cloud.sprite.WIDTH,
      Cloud.sprite.HEIGHT,
      this.X,
      this.Y,
      Cloud.sprite.WIDTH,
      Cloud.sprite.HEIGHT
    )
    this.canvasCtx.restore()
  }

  /**
   * 更新云朵的位置
   * @param speed
   */
  update(speed: number) {
    if (!this.isHide) {
      this.X -= Math.ceil(speed)
      this.draw()
    }
  }

  /**
   * 检测是否超出画布
   */
  get isHide() {
    return this.X < -Cloud.sprite.WIDTH
  }
}
