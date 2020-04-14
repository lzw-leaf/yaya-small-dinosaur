// import {CANVAS_WIDTH, CANVAS_HEIGHT, Run_BOTTOM_PAD} from './constants'
import runTime from '@/utils/runTime'
import imageSprite from './ImageSprite'
import { getTimeStamp } from '@/utils'

import { Sprite, TrexStatus } from './types'
import Game from '.'

/**
 * Trex
 * @param {CanvasRenderingContext2D} canvasCtx 载入到实例的canvas2D上下文
 * @param {Sprite} sprite 实例的精灵信息
 * @constructor
 */
export default class Trex {
  // 小恐龙的精灵图位置
  static sprite: Sprite = { X: 1942, Y: 2, WIDTH: 88, HEIGHT: 90 }
  /**
   * 小恐龙的基本配置
   */

  static config = {
    HEIGHT: 47,
    WIDTH: 44,
    HEIGHT_DUCK: 47,
    WIDTH_DUCK: 59,
    FOOTSINK: 20,
    MAX_JUMP_HEIGHT: 60,
    MIN_JUMP_HEIGHT: 60,
    INIITAL_JUMP_VELOCITY: -10,
    DROP_VELOCITY: -5,
    SPEED_DROP_COEFFICIENT: 3, //下降速度系数
    GRAVITY: 0.6, //重力
    BLINK_TIMING: 5000 //5秒眨眼睛
  }
  // 精灵各类行为帧序列
  static behavior = {
    WAITING: [
      { X: 1678, Y: 2 },
      { X: 1766, Y: 2 }
    ],
    RUNNING: [
      { X: 1854, Y: 2 },
      { X: 1942, Y: 2 }
    ],
    JUMPING: [{ X: 1678, Y: 2 }],
    DUCKING: [],
    CRASHED: []
  }
  // 各类行为的 (毫秒/帧)
  static behaviorFrameStamp = {
    WAITING: 1000 / 3,
    DUCKING: 1000 / 8,
    RUNNING: 1000 / 12,
    JUMPING: 1000 / 60,
    CRASHED: 1000 / 60
  }

  // 基础Y轴坐标
  baseY = Game.config.CANVAS_HEIGHT - Trex.sprite.HEIGHT - Trex.config.FOOTSINK

  X = 30 // 恐龙的X坐标(不变)
  Y = 0 // 角色的Y坐标

  deltaTime = 0 //增量时间

  // 状态控制
  crashed = false
  jumping = false
  ducking = false
  // waiting = true
  running = false
  status: TrexStatus = 'WAITING'
  speedDrop = false

  // WAITING
  blinkDelay = 0 //眨眼频率时间
  eyesOpenTime = 0 //睁眼开始时间
  eyesCloseTime = 200 //闭目时间

  // JUMPING
  jumpCount = 0
  jumpLimitY = this.baseY - Trex.config.MAX_JUMP_HEIGHT
  jumpVelocity = Trex.config.INIITAL_JUMP_VELOCITY - Game.currentSpeed / 10 //跳跃速度
  landing = false

  currentBehavior: number[] = [] // 猜测:当前行为的精灵图坐标
  currentBehaviorIndex = 0 // 猜测:当前行为的精灵图X索引
  currentMsPerFrame = 1000 / runTime.getFPS() //当前性能帧频

  constructor(public canvasCtx: CanvasRenderingContext2D) {
    this.init()
  }

  init() {
    this.Y = this.baseY
    this.jumpLimitY = this.baseY - Trex.config.MIN_JUMP_HEIGHT
    this.update(0)
  }

  /**
   * Setter for the jump velocity.
   * The approriate drop velocity is also set.
   */
  // setJumpVelocity(setting) {
  //   Trex.config.INIITAL_JUMP_VELOCITY = -setting
  //   Trex.config.DROP_VELOCITY = -setting / 2
  // }

  /**
   * @通用方法 更新画布
   * @param  deltaTime
   */
  update(deltaTime: number) {
    this.deltaTime += deltaTime
    this.currentBehaviorIndex = 0
    this.status === 'WAITING' && this.startWait()
    this.status === 'JUMPING' && this.startJump(deltaTime)

    this.status === 'RUNNING' && console.log('跑起来！！')

    const { X, Y } = Trex.behavior[this.status][this.currentBehaviorIndex]
    this.draw(X, Y)
  }

  draw(spriteX: number, spriteY: number) {
    let spriteWidth = Trex.sprite.WIDTH
    let spriteHeight = Trex.sprite.HEIGHT

    if (!this.crashed && this.ducking) {
      //ducking
      spriteWidth = Trex.config.WIDTH_DUCK
      spriteHeight = Trex.config.HEIGHT_DUCK
    } else {
      // 躲避时崩溃的特殊处理
      this.ducking && this.X++
      // Standing / running
    }

    this.canvasCtx.drawImage(
      imageSprite.image,
      spriteX,
      spriteY,
      spriteWidth,
      spriteHeight,
      this.X,
      this.Y,
      spriteWidth,
      spriteHeight
    )
  }

  /**
   * 等待中的眨眼序列
   */
  startWait() {
    const now = getTimeStamp()
    //没有凝目时间就等待
    if (!this.eyesOpenTime) {
      this.eyesOpenTime = now
      this.blinkDelay = Math.ceil(Math.random() * Trex.config.BLINK_TIMING)
    } else {
      const stareTime = now - this.eyesOpenTime
      // 等待0.2秒眨眼
      if (stareTime > this.blinkDelay + this.eyesCloseTime) {
        this.eyesOpenTime = 0
      } else if (stareTime >= this.blinkDelay) {
        this.currentBehaviorIndex = 1
      }
    }
  }

  /**
   *跳跃中的帧序列
   * @param deltaTime
   */
  startJump(deltaTime: number) {
    console.log('哈哈')

    // 猜测 增量时间内所可执行的有效帧数
    const framesElapsed = deltaTime / this.currentFrameStamp
    const { MAX_JUMP_HEIGHT, SPEED_DROP_COEFFICIENT } = Trex.config
    // 默认上升
    let increment = this.jumpVelocity * framesElapsed

    // 如果按下闪躲键将加快降落
    this.speedDrop || (increment *= SPEED_DROP_COEFFICIENT)
    //判断降落
    this.landing || (this.Y <= MAX_JUMP_HEIGHT && (this.landing = true))
    this.landing && (increment = Math.abs(increment))
    this.Y += Math.round(increment)
    if (this.isReachGround) {
      this.landing = false
      this.status = 'RUNNING'
      this.Y = this.baseY
    }
  }

  /**
   * 跳跃完成，开始降落
   */
  endJump() {
    this.landing &&
      this.jumpVelocity < Trex.config.DROP_VELOCITY &&
      (this.jumpVelocity = Trex.config.DROP_VELOCITY)
  }

  // 当前行为帧所占毫秒
  get currentFrameStamp() {
    return Trex.behaviorFrameStamp[this.status]
  }

  // 落地状态
  get isReachGround() {
    return this.Y >= this.baseY
  }
  /**
   * 设置落地速度
   */
  setSpeedDrop() {
    this.speedDrop = true
    this.jumpVelocity = 1
  }

  /**
   * 设置躲避状态
   * @param  isDucking.
   */
  setDuck(isDucking: boolean) {
    if (isDucking && this.status !== 'DUCKING') {
      this.update(0, 'DUCKING')
      this.ducking = true
    } else if (this.status === 'DUCKING') {
      this.update(0, 'RUNNING')
      this.ducking = false
    }
  }

  /**
   * 将角色重置到地面状态
   */
  reset() {
    this.Y = this.baseY
    this.jumpVelocity = 0
    this.jumping = false
    this.ducking = false
    this.update(0, 'RUNNING')
    this.speedDrop = false
    this.crashed = false
  }
}
