import imageSprite from './ImageSprite'
import { Sprite } from '../types'
import Game from '..'
import { eventBus } from '@/utils/eventBus'
import Stage from '../stage'

/**
 * 月亮
 * 没有碰撞体积的装饰物
 * @param {CanvasRenderingContext2D} canvasCtx 载入到实例的canvas2D上下文
 * @constructor
 */
export default class Moon {
  // 月亮的精灵图位置
  static sprite: Sprite = { X: 1195, Y: 2, WIDTH: 39, HEIGHT: 80 }
  /**
   * 月亮基本配置
   * @enum {number}
   */
  static config = {
    MAX_SKY_LEVEL: 30,
    MIN_SKY_LEVEL: 30,
    ALTERNATE_TIME: 30000
  }

  cumulativeTime = 0

  // 基于容器坐标
  X = Game.config.CANVAS_WIDTH
  Y = Moon.config.MIN_SKY_LEVEL

  constructor(public canvasCtx: CanvasRenderingContext2D) {}
  /**
   * 绘制地面
   */
  draw() {
    this.canvasCtx.drawImage(
      imageSprite.image,
      Moon.sprite.X,
      Moon.sprite.Y,
      Moon.sprite.WIDTH,
      Moon.sprite.HEIGHT,
      this.X,
      this.Y,
      Moon.sprite.WIDTH,
      Moon.sprite.HEIGHT
    )
  }

  /**
   * 更新月亮的位置
   * @param deltaTime
   */
  update(deltaTime: number, speed: number) {
    this.cumulativeTime += deltaTime
    if (Stage.isNight) {
      this.isHide && (this.X = Game.config.CANVAS_WIDTH)
      this.X -= speed
      this.draw()
    }
    if (this.cumulativeTime >= Moon.config.ALTERNATE_TIME && this.isHide) {
      eventBus.$emit('alternate', !Stage.isNight)
      this.cumulativeTime = 0
    }
  }

  /**
   * 检测是否超出画布
   */
  get isHide() {
    return this.X < -Moon.sprite.WIDTH
  }
}
