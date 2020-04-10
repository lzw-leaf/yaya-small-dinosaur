import runTime from '@/utils/runTime'
import imageSprite from './ImageSprite'
import { Sprite } from './types'

/**
 * 地面
 * 有两块地面组成，随机生成陡峭/平坦的地面
 * @param {CanvasRenderingContext2D} canvasCtx 载入到实例的canvas2D上下文
 * @param {Sprite} sprite 实例的精灵信息
 * @constructor
 */
export default class Ground {
  /**
   * Ground config.
   * @enum {number}
   */
  static config = {
    WIDTH: 600,
    HEIGHT: 12,
    YPOS: 127
  }
  // 容器中的尺寸
  dimensions = Ground.config
  // 容器中的双图X轴起点列表 [image1X,image2X]
  xPosList = [0, Ground.config.WIDTH]
  // 精灵图的尺寸
  spriteDimensions = Ground.config
  // 精灵图的双图X轴起点列表 [image1X,image2X]
  spriteXPosList: number[] = []
  // 板块碰撞隔值
  bumpThreshold = 0.5

  constructor(public canvasCtx: CanvasRenderingContext2D, public sprite: Sprite) {
    this.spriteXPosList = [sprite.X, sprite.X + this.dimensions.WIDTH]
    this.bumpThreshold = 0.5
    this.draw()
  }
  /**
   * 绘制地面.
   */
  draw() {
    this.canvasCtx.drawImage(
      imageSprite.image,
      this.spriteXPosList[0],
      this.sprite.Y,
      this.spriteDimensions.WIDTH,
      this.spriteDimensions.HEIGHT,
      this.xPosList[0],
      Ground.config.YPOS,
      this.dimensions.WIDTH,
      this.dimensions.HEIGHT
    )

    this.canvasCtx.drawImage(
      imageSprite.image,
      this.spriteXPosList[1],
      this.sprite.Y,
      this.spriteDimensions.WIDTH,
      this.spriteDimensions.HEIGHT,
      this.xPosList[1],
      Ground.config.YPOS,
      this.dimensions.WIDTH,
      this.dimensions.HEIGHT
    )
  }

  /**
   * 更新地面板块的X的位置
   * @param {number} imageNumber 地面图序号.
   * @param {number} increment
   */
  updateXPos(groundIndex: number, increment: number) {
    const otherGroundIndex = groundIndex === 0 ? 1 : 0

    this.xPosList[groundIndex] -= increment
    this.xPosList[otherGroundIndex] = this.xPosList[groundIndex] + this.dimensions.WIDTH

    if (this.xPosList[groundIndex] <= -this.dimensions.WIDTH) {
      this.xPosList[groundIndex] += this.dimensions.WIDTH * 2
      this.xPosList[otherGroundIndex] = this.xPosList[groundIndex] - this.dimensions.WIDTH
      this.spriteXPosList[groundIndex] = this.getRandomType() + this.sprite.X
    }
  }

  /**
   * @通用方法名  canvas更新
   * @param {number} deltaTime
   * @param {number} speed
   */
  update(deltaTime: number, speed: number) {
    const increment = Math.floor(speed * (runTime.getFPS() / 1000) * deltaTime)
    this.updateXPos(Number(this.xPosList[0] <= 0), increment)
    this.draw()
  }

  /**
   * 重置地面位置
   */
  reset() {
    this.xPosList[0] = 0
    this.xPosList[1] = Ground.config.WIDTH
  }
  /**
   * 猜测 随机陡峭地面用
   */
  getRandomType() {
    return Math.random() > this.bumpThreshold ? this.dimensions.WIDTH : 0
  }
}
