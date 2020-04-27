import imageSprite from './ImageSprite'
import { Sprite, TrexStatus } from '../types'
import Game from '..'
import CollisionBox from '../role/CollisionBox'

import cloneDeep from 'lodash/cloneDeep'

/**
 * Trex
 * @param {CanvasRenderingContext2D} canvasCtx 载入到实例的canvas2D上下文
 * @param {Sprite} sprite 实例的精灵信息
 * @constructor
 */
export default class Trex {
  // 小恐龙的精灵图位置
  static sprite: Sprite = { X: 1942, Y: 2, WIDTH: 88, HEIGHT: 94 }

  /**
   * 小恐龙的基本配置
   */
  static config = {
    HEIGHT_DUCK: 60,
    WIDTH_DUCK: 118,
    FOOTSINK: 20, //下限尺寸
    MAX_JUMP_HEIGHT: 60,
    MIN_JUMP_HEIGHT: 60, //弹性弹跳先不做
    INIITAL_JUMP_VELOCITY: -20,
    SPEED_DROP_COEFFICIENT: 3, //下降速度系数
    GRAVITY: 1.2, //重力
    BLINK_TIMING: 7000 //7秒延时眼睛
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
    DUCKING: [
      { X: 2206, Y: 36 },
      { X: 2324, Y: 36 }
    ],
    CRASHED: [{ X: 2030, Y: 2 }]
  }

  // 各类行为切换所需（毫秒/帧）
  static behaviorFrameStamp = {
    WAITING: 1000 / 3,
    DUCKING: 1000 / 8,
    RUNNING: 1000 / 12,
    JUMPING: 1000 / 60,
    CRASHED: 1000 / 60
  }

  // 当前精灵行为索引
  currentBehaviorIndex = 0

  collisionBoxs: CollisionBox[]

  // 基础Y轴坐标
  baseY = Game.config.CANVAS_HEIGHT - Trex.sprite.HEIGHT - Trex.config.FOOTSINK

  X = 30 // 恐龙的X坐标(不变)
  Y = this.baseY // 角色的Y坐标

  readonly behaviorCollsionBoxMap = {
    WAITING: [
      new CollisionBox(32, 218, 20, 40),
      new CollisionBox(50, 220, 34, 60),
      new CollisionBox(84, 220, 10, 35),
      new CollisionBox(95, 220, 6, 20),
      new CollisionBox(72, 188, 44, 35)
    ],
    RUNNING: [
      new CollisionBox(32, 218, 20, 40),
      new CollisionBox(50, 220, 34, 60),
      new CollisionBox(84, 220, 10, 35),
      new CollisionBox(95, 220, 6, 20),
      new CollisionBox(72, 188, 44, 35)
    ],
    JUMPING: [
      new CollisionBox(32, 218, 20, 40),
      new CollisionBox(50, 220, 34, 60),
      new CollisionBox(84, 220, 10, 35),
      new CollisionBox(95, 220, 6, 20),
      new CollisionBox(72, 188, 44, 35)
    ],
    DUCKING: [new CollisionBox(this.X, this.Y, 118, 60)],
    CRASHED: [
      new CollisionBox(32, 218, 20, 40),
      new CollisionBox(50, 220, 34, 60),
      new CollisionBox(84, 220, 10, 35),
      new CollisionBox(95, 220, 6, 20),
      new CollisionBox(72, 188, 44, 35)
    ]
  }

  cumulativeTime = 0 //动作时间
  status: TrexStatus = 'WAITING'

  // WAITING
  blinkTimeout = 0 //眨眼计时器
  blinkDelay = 0 //眨眼频率时间
  isWaitBlik = false //是否等待眨眼

  // JUMPING
  jumpCount = 0
  jumpLimitY = this.baseY - Trex.config.MAX_JUMP_HEIGHT
  jumpVelocity = Trex.config.INIITAL_JUMP_VELOCITY - Game.currentSpeed / 10 //跳跃速度
  landing = false
  speedDrop = false

  constructor(public canvasCtx: CanvasRenderingContext2D) {
    this.Y = this.baseY
    this.collisionBoxs = cloneDeep(this.behaviorCollsionBoxMap.WAITING)
    this.draw()
  }

  /**
   * @通用方法 更新画布
   * @param  deltaTime
   */
  update(deltaTime: number) {
    const oldX = this.X
    const oldY = this.Y
    const oldStatus = this.status
    this.cumulativeTime += deltaTime
    const statusUpdateMap = {
      WAITING: () => this.startWait(),
      JUMPING: () => this.updateJump(deltaTime),
      RUNNING: () => this.updateRunAndDuck(),
      DUCKING: () => this.updateRunAndDuck(),
      CRASHED: () => this.updateCrashed()
    }

    statusUpdateMap[this.status]()
    this.draw()

    // 设置碰撞盒子
    let differenceX = this.X - oldX
    let differenceY = this.Y - oldY
    if (oldStatus !== this.status) {
      differenceX = differenceY = 0
      this.collisionBoxs = cloneDeep(this.behaviorCollsionBoxMap[this.status])
    }

    this.collisionBoxs.forEach(box => {
      box.setPosition(box.X + differenceX, box.Y + differenceY)
    })
  }

  draw() {
    const { X, Y } = Trex.behavior[this.status][this.currentBehaviorIndex]
    let spriteWidth = Trex.sprite.WIDTH
    let spriteHeight = Trex.sprite.HEIGHT

    if (this.status === 'DUCKING') {
      spriteWidth = Trex.config.WIDTH_DUCK
      spriteHeight = Trex.config.HEIGHT_DUCK
    }

    this.canvasCtx.drawImage(
      imageSprite.image,
      X,
      Y,
      spriteWidth,
      spriteHeight,
      this.X,
      this.Y,
      spriteWidth,
      spriteHeight
    )
  }

  /**
   * 奔跑和闪躲的序列
   */
  updateRunAndDuck() {
    if (this.cumulativeTime >= this.currentFrameStamp) {
      // 0，1转换
      this.currentBehaviorIndex = this.currentBehaviorIndex ^ 1
      this.cumulativeTime = 0
    }
  }

  /**
   *跳跃序列
   * @param deltaTime
   */
  updateJump(deltaTime: number) {
    this.currentBehaviorIndex = 0
    // 已知 requestAnimationFrame 每秒执行60次  16.66..ms执行1次
    // jump的FrameStamp也等于
    // 既当每次Update之间的deltaTime的是恒定，则framesElapsed恒定1
    // 用来控制每次方法之间增量时间不均匀时，保证速度匀速
    const framesElapsed = deltaTime / this.currentFrameStamp
    const { SPEED_DROP_COEFFICIENT } = Trex.config
    // 默认上升
    let increment = this.jumpVelocity * framesElapsed
    // 如果按下闪躲键将加快降落
    this.speedDrop && (increment = Math.abs(increment * SPEED_DROP_COEFFICIENT))
    //判断降落
    if (this.Y <= this.jumpLimitY || this.speedDrop) {
      this.landing = true
    }
    this.Y += Math.round(increment)
    // 增加重力
    this.jumpVelocity += Trex.config.GRAVITY * framesElapsed
    // 落地奔跑
    if (this.landing && this.Y >= this.baseY) {
      this.landing = false
      this.status = this.speedDrop ? 'DUCKING' : 'RUNNING'
      this.cumulativeTime = 0
      this.Y = this.baseY
      this.speedDrop && (this.Y += 28)
    }
  }

  /**
   * 碰撞序列
   */
  updateCrashed() {
    this.currentBehaviorIndex = 0
  }

  /**
   * 等待眨眼序列
   */
  startWait() {
    // 设置眨眼
    this.isWaitBlik = true
    this.blinkDelay = Math.ceil(Math.random() * Trex.config.BLINK_TIMING)
    this.blinkTimeout = setTimeout(() => {
      if (this.status !== 'WAITING') {
        clearTimeout(this.blinkTimeout)
        return
      }
      this.currentBehaviorIndex = 1
      this.draw()
      setTimeout(() => {
        this.isWaitBlik = false
        this.currentBehaviorIndex = 0
        this.draw()
        this.startWait()
      }, 200)
    }, this.blinkDelay)
  }

  /**
   * 跳跃按下指令
   */
  startJump() {
    this.status = 'JUMPING'
    this.jumpVelocity = Trex.config.INIITAL_JUMP_VELOCITY - 7 / 10 //跳跃速度
    this.speedDrop = false
  }

  /**
   * 闪避按下指令
   */
  startDuck() {
    this.status = 'DUCKING'
    this.Y = this.baseY + 28
  }
  /**
   * 闪避松开指令
   */
  endDuck() {
    this.status = 'RUNNING'
    this.Y = this.baseY
  }

  reSet() {
    this.status = 'RUNNING'
    this.Y = this.baseY
  }

  // 当前行为帧所占毫秒
  get currentFrameStamp() {
    return Trex.behaviorFrameStamp[this.status]
  }
}
