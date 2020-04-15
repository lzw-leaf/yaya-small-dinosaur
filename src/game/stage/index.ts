// import Obstacle from './Obstacle'
import Cloud from '../sprite/Cloud'
import Ground from '../sprite/Ground'
import Game from '..'

export default class Stage {
  /**
   * Stage config.
   * @enum {number}
   */
  static config = {
    BG_CLOUD_SPEED: 0.2,
    BUMPY_THRESHOLD: 0.3,
    CLOUD_FREQUENCY: 0.5, //控制云的随机出现
    MAX_CLOUDS: 6 //云朵最大数量
  }

  // obstacleList: Obstacle[] = []
  cloudList: Cloud[] = []
  ground: Ground

  /**
   * 初始化游戏舞台，只要云、地面和恐龙，无需障碍物
   */
  constructor(public canvasCtx: CanvasRenderingContext2D) {
    this.ground = new Ground(this.canvasCtx)
  }

  init() {
    console.log('初始化游戏舞台')
    this.addCould()
  }

  update(deltaTime: number, currentSpeed: number) {
    this.ground.update(deltaTime, currentSpeed)
    this.updateCloudList(deltaTime, currentSpeed)
  }

  updateCloudList(deltaTime: number, currentSpeed: number) {
    // 执行过程产生的时间*每毫秒的云基础速度*当前速度
    const cloudSpeed = (Stage.config.BG_CLOUD_SPEED / 1000) * deltaTime * currentSpeed
    this.cloudList.forEach(cloud => cloud.update(cloudSpeed))

    // 序列没有云朵就添加一个云朵
    this.cloudList.length || this.addCould()
    const cloudCount = this.cloudList.length

    // 最后随机补云
    const lastCloud = this.cloudList[cloudCount - 1]
    const { CANVAS_WIDTH } = Game.config
    const { MAX_CLOUDS, CLOUD_FREQUENCY } = Stage.config
    if (
      CANVAS_WIDTH - lastCloud.X >= lastCloud.cloudGap &&
      CLOUD_FREQUENCY > Math.random() &&
      cloudCount < MAX_CLOUDS
    ) {
      this.addCould()
    }
    this.cloudList = this.cloudList.filter(cloud => !cloud.isHide)
  }
  addCould() {
    this.cloudList.push(new Cloud(this.canvasCtx))
  }
}
