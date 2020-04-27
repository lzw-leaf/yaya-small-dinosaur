import imageSprite from '@/game/sprite/ImageSprite'
import { Sprite } from '../types'
import Game from '..'
import { eventBus } from '@/utils/eventBus'

/**
 * 星星
 * 没有碰撞体积的装饰物
 * @param {CanvasRenderingContext2D} canvasCtx 载入到实例的canvas2D上下文
 * @constructor
 */
export default class DistanceMeter {
  // 数字的精灵序列
  static sprite: Sprite = { X: 1294, Y: 2, WIDTH: 18, HEIGHT: 22 }
  // 精灵图中数字的距离差
  static numberSpriteDistance = 20
  static wordsSprite: Sprite = { X: 1514, Y: 2, WIDTH: 20, HEIGHT: 18 }
  /**
   * 星星基本配置
   * @enum {number}
   */
  static config = {
    NUMBER_WIDTH: 20,
    FLASH_TIME: 2000,
    FLAGH_FREQUENCY: 400
  }

  maxScoreUnits = 5
  static currentMaxScore = 0

  highScore: number //历史最高分

  // 距离计算使用
  cumulativeTime = 0 //累加时间

  // 闪烁配置
  isFlash = false
  alearyChangeTime = 0 //明暗切换时间
  alearyFlashTime = 0 //已闪烁时间

  // 基于容器坐标
  X = Game.config.CANVAS_WIDTH - 2 * DistanceMeter.config.NUMBER_WIDTH
  Y = 5

  constructor(public canvasCtx: CanvasRenderingContext2D) {
    this.highScore = parseInt(localStorage.highScore) || 0
    eventBus.$on('crashed', () => this.contrastScore())
  }

  init() {
    for (let i = 0; i < this.maxScoreUnits; i++) {
      this.draw(i, 0)
    }
    this.drawHighScore()
  }

  /**
   * 绘制数字
   */
  draw(unitIndex: number, value: number, isHigh = false) {
    let leaveBlankCount = 1
    isHigh && (leaveBlankCount = this.maxScoreUnits + 2)
    const { sprite, config } = DistanceMeter
    const spriteX = sprite.X + value * config.NUMBER_WIDTH
    const canvasX = this.X - (unitIndex + leaveBlankCount) * config.NUMBER_WIDTH

    this.canvasCtx.save()
    this.canvasCtx.drawImage(
      imageSprite.image,
      spriteX,
      DistanceMeter.sprite.Y,
      DistanceMeter.sprite.WIDTH,
      DistanceMeter.sprite.HEIGHT,
      canvasX,
      this.Y,
      DistanceMeter.sprite.WIDTH,
      DistanceMeter.sprite.HEIGHT
    )
    this.canvasCtx.restore()
  }

  update(deltaTime: number) {
    const increment = this.getActualDistance(deltaTime)
    // 用于控制闪烁
    const oldScore = DistanceMeter.currentMaxScore
    DistanceMeter.currentMaxScore += increment

    let isDraw = true
    let showScore = DistanceMeter.currentMaxScore
    Math.floor(oldScore / 100) < Math.floor(DistanceMeter.currentMaxScore / 100) &&
      (this.isFlash = true)
    if (this.isFlash) {
      isDraw = false
      // 总闪烁时间
      this.alearyFlashTime += deltaTime
      if (this.alearyFlashTime > DistanceMeter.config.FLASH_TIME) {
        this.isFlash = false
        this.alearyFlashTime = 0
      }
      // 闪烁间隔控制
      this.alearyChangeTime += deltaTime
      const { FLAGH_FREQUENCY } = DistanceMeter.config
      if (this.alearyChangeTime > 2 * FLAGH_FREQUENCY) {
        this.alearyChangeTime = 0
      } else if (this.alearyChangeTime > FLAGH_FREQUENCY) {
        isDraw = true
        showScore = Math.floor(DistanceMeter.currentMaxScore / 100) * 100
      }
    }
    const scoreUnitValueList = String(showScore).split('')
    this.complementZeroByMaxUnit(scoreUnitValueList)
    if (isDraw) {
      scoreUnitValueList.forEach((number, index) =>
        this.draw(scoreUnitValueList.length - 1 - index, Number(number))
      )
    }
    this.drawHighScore()
  }

  drawHighScore() {
    this.canvasCtx.globalAlpha = 0.6
    const highScoreUnitList = String(this.highScore).split('')
    this.complementZeroByMaxUnit(highScoreUnitList)
    highScoreUnitList.unshift(...['10', '11', '12'])
    highScoreUnitList.forEach((number, index) =>
      this.draw(highScoreUnitList.length - 1 - index, Number(number), true)
    )
    this.canvasCtx.globalAlpha = 1
  }
  /**
   * 对比替换当前分和历史最高分
   */
  contrastScore() {
    if (DistanceMeter.currentMaxScore > this.highScore) {
      this.highScore = DistanceMeter.currentMaxScore
      localStorage.highScore = this.highScore
    }
  }

  reSet() {
    DistanceMeter.currentMaxScore = 0
    this.init()
  }

  /**
   * 计算获得实际分距离
   * @param deltaTime
   */
  getActualDistance(deltaTime: number) {
    this.cumulativeTime += deltaTime
    const increment = Math.round((Game.currentSpeed / 1500) * this.cumulativeTime)
    increment && (this.cumulativeTime = 0)
    return increment
  }

  /**
   * 根据最大单位前置补零
   * @param numberList 填充的数字列表
   */
  complementZeroByMaxUnit(numberList: Array<string | number>) {
    // 前置补零
    while (numberList.length < this.maxScoreUnits) {
      numberList.unshift('0')
    }
  }
}
