// import {CANVAS_WIDTH, CANVAS_HEIGHT, Run_BOTTOM_PAD} from './constants'
import runTime from '@/utils/runTime'
import imageSprite from './ImageSprite'
import { getTimeStamp } from '@/utils'

import { Sprite } from './types'
import Runner from './Runner'

/**
 * Trex
 * @param {CanvasRenderingContext2D} canvasCtx 载入到实例的canvas2D上下文
 * @param {Sprite} sprite 实例的精灵信息
 * @constructor
 */
export default class Trex {
  static config = {
    HEIGHT: 47,
    WIDTH: 44,
    HEIGHT_DUCK: 47,
    WIDTH_DUCK: 59,
    FOOTSINK: 10,
    MAX_JUMP_HEIGHT: 30,
    MIN_JUMP_HEIGHT: 30,
    INIITAL_JUMP_VELOCITY: -10,
    DROP_VELOCITY: -5,
    SPEED_DROP_COEFFICIENT: 3, //下降速度系数
    GRAVITY: 0.6, //重力
    BLINK_TIMING: 7000
  }

  static behavior = {
    WAITING: {
      // 猜测:为精灵图的样式 X定位
      frames: [44, 0],
      // 猜测:为性能频率
      msPerFrame: 1000 / 3
    },
    RUNNING: {
      frames: [88, 132],
      msPerFrame: 1000 / 12
    },
    CRASHED: {
      frames: [220],
      msPerFrame: 1000 / 60
    },
    JUMPING: {
      frames: [0],
      msPerFrame: 1000 / 60
    },
    DUCKING: {
      frames: [262, 321],
      msPerFrame: 1000 / 8
    }
  }

  X = 0 // 角色的X坐标
  Y = 0 // 角色的Y坐标
  baseY = 0 // 基础Y轴坐标
  minJumpHeight = 0 //最小跳跃高度
  jumpVelocity = 0 //跳跃速度

  // 状态控制
  crashed = false
  jumping = false
  ducking = false
  waiting = true
  running = false
  status = 'WAITING'
  speedDrop = false

  blinkDelay = 0 //闪烁延迟
  blinkCount = 0 //闪烁数量

  deltaTime = 0 //增量时间
  activeStartTime = 0 //性能开始时间戳

  currentBehavior: number[] = [] // 猜测:当前行为的精灵图坐标
  currentBehaviorIndex = 0 // 猜测:当前行为的精灵图X索引
  currentMsPerFrame = 1000 / runTime.getFPS() //当前性能帧频

  constructor(public canvasCtx: CanvasRenderingContext2D, public sprite: Sprite) {
    this.init()
  }

  /**
   * T-rex player initaliser.
   * Sets the t-rex to blink at random intervals.
   */
  init() {
    this.baseY = Runner.CANVAS_HEIGHT - Trex.config.HEIGHT - Trex.config.FOOTSINK
    this.Y = this.baseY
    this.minJumpHeight = this.baseY - Trex.config.MIN_JUMP_HEIGHT

    this.draw(0, 0)
    this.update(0, 'WAITING')
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
  update(deltaTime: number, status: keyof typeof Trex.behavior | '' = '') {
    this.deltaTime += deltaTime

    // Update the status.
    if (status) {
      this.currentBehaviorIndex = 0
      this.currentMsPerFrame = Trex.behavior[status].msPerFrame
      this.currentBehavior = Trex.behavior[status].frames
      if (status === 'WAITING') {
        this.activeStartTime = getTimeStamp()
        this.setBlinkDelay()
        this.blink(getTimeStamp())
      }
    }

    this.status === 'WAITING' ||
      this.draw(this.currentBehavior[this.currentBehaviorIndex], 0)

    // 更新行为帧
    if (this.deltaTime >= this.currentMsPerFrame) {
      this.currentBehaviorIndex =
        this.currentBehaviorIndex === this.currentBehavior.length - 1
          ? 0
          : this.currentBehaviorIndex + 1
      this.deltaTime = 0
    }
    // 持续按下下蹲键，速度降低
    if (this.speedDrop && this.Y === this.baseY) {
      this.speedDrop = false
      this.setDuck(true)
    }
  }

  /**
   * 绘制角色动态帧.
   * @param x
   * @param y
   */
  draw(x: number, y: number) {
    const sourceX = x + this.sprite.X
    const sourceY = y + this.sprite.Y
    let sourceHeight = Trex.config.HEIGHT
    let sourceWidth = Trex.config.WIDTH

    if (!this.crashed && this.ducking) {
      //ducking
      sourceWidth = Trex.config.WIDTH_DUCK
      sourceHeight = Trex.config.HEIGHT_DUCK
    } else {
      // 躲避时崩溃的特殊处理
      this.ducking && this.X++
      // Standing / running
    }
    this.canvasCtx.drawImage(
      imageSprite.image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      this.X,
      this.Y,
      sourceWidth,
      sourceHeight
    )
  }

  /**
   * 设置校色的随机闪烁延迟
   */
  setBlinkDelay() {
    this.blinkDelay = Math.ceil(Math.random() * Trex.config.BLINK_TIMING)
  }

  /**
   * 使角色随机闪烁
   * @param {number} time 当前时间（毫秒）
   */
  blink(time: number) {
    const deltaTime = time - this.activeStartTime
    if (deltaTime >= this.blinkDelay) {
      this.draw(this.currentBehavior[this.currentBehaviorIndex], 0)
      if (this.currentBehaviorIndex === 1) {
        this.setBlinkDelay()
        this.activeStartTime = time
        this.blinkCount += 1
      }
    }
  }

  /**
   * Initialise a jump.
   * @param {number} speed
   */
  startJump(speed: number) {
    if (speed === undefined) {
      speed = Runner._instance.currentSpeed
    }
    if (!this.jumping) {
      this.update(0, 'JUMPING')
      // Tweak the jump velocity based on the speed.
      this.jumpVelocity = Trex.config.INIITAL_JUMP_VELOCITY - speed / 10
      this.jumping = true
      this.speedDrop = false
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

  /**
   * 更新跳跃帧
   * @param deltaTime
   */
  updateJump(deltaTime: number) {
    const { msPerFrame } = Trex.behavior[this.status as keyof typeof Trex.behavior]
    const framesElapsed = deltaTime / msPerFrame

    // 向下将增加下降速度
    const increment = this.speedDrop ? Trex.config.SPEED_DROP_COEFFICIENT : 1
    this.Y += Math.round(this.jumpVelocity * framesElapsed * increment)
    this.jumpVelocity += Trex.config.GRAVITY * framesElapsed
    // 检测是否到达最大高度
    if (this.Y < Trex.config.MAX_JUMP_HEIGHT || this.speedDrop) {
      this.endJump()
    }
    // 降落成功
    this.Y > this.baseY && this.reset()
    this.update(deltaTime)
  }

  // 落地状态
  get landing() {
    return this.Y < this.minJumpHeight || this.speedDrop
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
