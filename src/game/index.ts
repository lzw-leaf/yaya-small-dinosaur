import Stage from './Stage'
import { getTimeStamp } from '@/utils'

export default class Game {
  static config = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 300,
    PLAYER_COUNT: 1,
    SPEED: 6
  }

  // 游戏舞台
  stage: Stage
  // 全局传递速度
  static currentSpeed = 0
  // 游戏消耗时长
  consumeTime = 0

  // 游戏状态
  playing = false
  crashed = false

  // 动画请求Id
  reqFrameId = 0

  constructor(
    public canvasCtx: CanvasRenderingContext2D,
    options: Partial<typeof Game.config>
  ) {
    Game.config = { ...Game.config, ...options }
    this.setBackground()
    this.stage = new Stage(this.canvasCtx)
    this.init()
  }
  init() {
    console.log('初始化游戏')
    this.playing = true
    Game.currentSpeed = Game.config.SPEED
    // this.adjustDimensions()
    // this.setSpeed()
    this.scheduleNextUpdate()
  }
  update() {
    const now = getTimeStamp()
    const deltaTime = now - (this.consumeTime || now)
    this.consumeTime = now
    if (this.playing) {
      this.clearCanvas()
      this.stage.update(deltaTime, Game.currentSpeed)
      this.scheduleNextUpdate()
    }
  }

  // 安排下一次更新
  scheduleNextUpdate() {
    this.reqFrameId = requestAnimationFrame(this.update.bind(this))
  }

  clearCanvas() {
    const { CANVAS_WIDTH, CANVAS_HEIGHT } = Game.config
    this.canvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  setBackground() {
    this.canvasCtx.fillStyle = '#f7f7f7'
    const { CANVAS_WIDTH, CANVAS_HEIGHT } = Game.config
    this.canvasCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  /**
   * 调整游戏空间尺寸大小
   */
  adjustDimensions() {
    console.log('调整游戏空间尺寸大小')
  }

  /**
   * 设置游戏速度
   */
  setSpeed() {
    console.log('设置游戏速度')
  }
}
