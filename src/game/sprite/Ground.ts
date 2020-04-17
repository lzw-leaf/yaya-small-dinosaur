import runTime from '@/utils/runTime'
import imageSprite from './ImageSprite'
import { Sprite } from '../types'
import Game from '..'

/**
 * 地面
 * 有两块地面组成，随机生成陡峭/平坦的地面
 * @param {CanvasRenderingContext2D} canvasCtx 载入到实例的canvas2D上下文
 * @param {Sprite} sprite 实例的精灵信息
 * @constructor
 */
export default class Ground {
  // 地面的精灵图位置
  static sprite: Sprite = { X: 0, Y: 104, WIDTH: 1200, HEIGHT: 24 }

  // 容器中的双图X轴起点列表 [image1X,image2X]
  xPosList = [Ground.sprite.X, Ground.sprite.WIDTH]
  Y = 254
  // 精灵图的双图X轴起点列表 [image1X,image2X]
  spriteXPosList: number[] = []
  // 板块碰撞隔值
  bumpThreshold = 0.5

  animationWidth = 160

  constructor(public canvasCtx: CanvasRenderingContext2D) {
    console.log('初始化地面')
    this.spriteXPosList = [Ground.sprite.X, Ground.sprite.X + Ground.sprite.WIDTH]
    this.bumpThreshold = 0.5
    this.init()
  }
  init() {
    this.canvasCtx.drawImage(
      imageSprite.image,
      this.spriteXPosList[0],
      Ground.sprite.Y,
      160,
      Ground.sprite.HEIGHT,
      this.xPosList[0],
      this.Y,
      160,
      Ground.sprite.HEIGHT
    )
  }

  draw() {
    this.canvasCtx.drawImage(
      imageSprite.image,
      this.spriteXPosList[0],
      Ground.sprite.Y,
      Ground.sprite.WIDTH,
      Ground.sprite.HEIGHT,
      this.xPosList[0],
      this.Y,
      Ground.sprite.WIDTH,
      Ground.sprite.HEIGHT
    )

    this.canvasCtx.drawImage(
      imageSprite.image,
      this.spriteXPosList[1],
      Ground.sprite.Y,
      Ground.sprite.WIDTH,
      Ground.sprite.HEIGHT,
      this.xPosList[1],
      this.Y,
      Ground.sprite.WIDTH,
      Ground.sprite.HEIGHT
    )
  }

  gameBoot() {
    this.canvasCtx.drawImage(
      imageSprite.image,
      this.spriteXPosList[0],
      Ground.sprite.Y,
      this.animationWidth,
      Ground.sprite.HEIGHT,
      this.xPosList[0],
      this.Y,
      this.animationWidth,
      Ground.sprite.HEIGHT
    )
    this.animationWidth += 50
  }
  /**
   * 更新地面板块的X的位置
   * @param {number} imageNumber 地面图序号.
   * @param {number} increment
   */
  updateXPos(groundIndex: number, increment: number) {
    const otherGroundIndex = groundIndex ? 0 : 1
    this.xPosList[otherGroundIndex] -= increment
    this.xPosList[groundIndex] = this.xPosList[otherGroundIndex] + Ground.sprite.WIDTH

    if (this.xPosList[otherGroundIndex] <= -Ground.sprite.WIDTH) {
      // 考虑速度过快情况
      this.xPosList[otherGroundIndex] += Ground.sprite.WIDTH * 2
      // 始终保持耦合
      this.xPosList[groundIndex] = this.xPosList[otherGroundIndex] - Ground.sprite.WIDTH
      this.spriteXPosList[otherGroundIndex] = this.getRandomType() + Ground.sprite.X
    }
  }

  /**
   * @通用方法名  canvas更新
   * @param {number} deltaTime
   * @param {number} speed
   */
  update(deltaTime: number) {
    const increment = Math.floor(
      Game.currentSpeed * (runTime.getFPS() / 1000) * deltaTime
    )
    this.updateXPos(Number(this.xPosList[0] <= 0), increment)
    this.draw()
  }

  /**
   * 重置地面位置
   */
  reset() {
    this.xPosList[0] = 0
    this.xPosList[1] = Ground.sprite.WIDTH
  }
  /**
   * 地图板块边界循环
   */
  getRandomType() {
    return Math.random() > this.bumpThreshold ? Ground.sprite.WIDTH : 0
  }
}
