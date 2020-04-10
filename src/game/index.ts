import Stage from './Stage'

export default class Game {
  static config = {
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 150,
    PLAYER_COUNT: 1
  }

  static spriteMap = {
    ClOUD: { X: 86, Y: 2, WIDTH: 1, HEIGHT: 1 }
  }

  stage: Stage | null = null
  constructor(
    public canvasCtx: CanvasRenderingContext2D,
    options: Partial<typeof Game.config>
  ) {
    Game.config = { ...Game.config, ...options }
  }
  init() {
    console.log('初始化游戏')
    // this.adjustDimensions()
    // this.setSpeed()
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
