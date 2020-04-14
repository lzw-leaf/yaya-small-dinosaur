import Stage from './Stage'
import { getTimeStamp } from '@/utils'
import Trex from './Trex'
import { GameStatus } from './types'

export default class Game {
  // 游戏基本设置
  static config = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 300,
    PLAYER_COUNT: 1,
    INIT_SPEED: 6
  }
  // 全局传递速度
  static currentSpeed = 0

  stage: Stage // 游戏舞台
  tRex: Trex // 恐龙

  // 游戏消耗时长
  consumeTime = 0
  // 游戏状态
  status: GameStatus = 'WAITING'

  // 动画请求Id
  reqFrameId = 0

  constructor(
    public canvasCtx: CanvasRenderingContext2D,
    options: Partial<typeof Game.config>
  ) {
    Game.config = { ...Game.config, ...options }
    this.stage = new Stage(this.canvasCtx)
    this.tRex = new Trex(this.canvasCtx)
    this.init()
  }
  init() {
    this.setSpeed(Game.config.INIT_SPEED)
    this.startListening()
    this.scheduleNextUpdate()
  }
  update() {
    const now = getTimeStamp()
    const deltaTime = now - (this.consumeTime || now)
    this.consumeTime = now
    this.clearCanvas()
    if (this.status === 'WAITING') {
      this.stage.ground.init()
    }
    if (this.status === 'BOOTING') {
      if (this.tRex.status === 'RUNNING') {
        this.stage.ground.gameBoot()
        this.stage.ground.animationWidth >= Game.config.CANVAS_WIDTH &&
          (this.status = 'PLAYING')
      } else {
        this.tRex.status = 'JUMPING'
        this.stage.ground.init()
      }
    }
    if (this.status === 'PLAYING') {
      this.stage.update(deltaTime, Game.currentSpeed)
    }
    this.tRex.update(deltaTime)
    this.scheduleNextUpdate()
  }

  // 安排下一次更新
  scheduleNextUpdate() {
    this.reqFrameId = requestAnimationFrame(this.update.bind(this))
  }

  clearCanvas() {
    const { CANVAS_WIDTH, CANVAS_HEIGHT } = Game.config
    this.canvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  setSpeed(speed: number) {
    speed && (Game.currentSpeed = speed)
  }

  startDrop() {
    console.log('开始下蹲')
  }
  onClick() {
    console.log('点击事件')
  }
  onkeydown(e: KeyboardEvent) {
    if ([87, 38, 32].includes(e.keyCode)) {
      this.status = 'BOOTING'
      this.scheduleNextUpdate()
    }

    ;[83, 40].includes(e.keyCode) && this.startDrop()
  }
  // onkeyup(e) {}
  startListening() {
    document.onclick = () => this.onClick()
    document.onkeydown = e => this.onkeydown(e)
    // document.onkeyup = e => this.onkeyup(e)
  }
}
