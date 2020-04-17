import { getRandomNum } from '@/utils'
import imageSprite from './ImageSprite'
import { Sprite } from '../types'
import Game from '..'
import Stage from '../stage'

/**
 * 星星
 * 没有碰撞体积的装饰物
 * @param {CanvasRenderingContext2D} canvasCtx 载入到实例的canvas2D上下文
 * @constructor
 */
export default class Star {
  // 星星的精灵图位置
  static spriteList: Sprite[] = [
    { X: 1274, Y: 2, WIDTH: 20, HEIGHT: 18 },
    { X: 1274, Y: 20, WIDTH: 20, HEIGHT: 18 },
    { X: 1274, Y: 38, WIDTH: 20, HEIGHT: 18 }
  ]
  /**
   * 星星基本配置
   * @enum {number}
   */

  static config = {
    MAX_SKY_LEVEL: 0,
    MIN_SKY_LEVEL: 120,
    MIN_GAD: 30
  }
  sprite: Sprite

  // 基于容器坐标
  X = Game.config.CANVAS_WIDTH
  Y = getRandomNum(Star.config.MIN_SKY_LEVEL, Star.config.MAX_SKY_LEVEL)

  constructor(public canvasCtx: CanvasRenderingContext2D, X?: number) {
    X && (this.X = X)
    this.sprite = Star.spriteList[getRandomNum(0, 2)]
    this.draw()
  }
  /**
   * 绘制地面
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
      this.sprite.WIDTH,
      this.sprite.HEIGHT
    )
    this.canvasCtx.restore()
  }

  /**
   * 更新星星的位置
   * @param speed
   */
  update(speed: number) {
    if (Stage.isNight && !this.isHide) {
      this.X -= speed
      this.draw()
    }
  }

  /**
   * 检测是否超出画布
   */
  get isHide() {
    return this.X < -this.sprite.WIDTH
  }
}
