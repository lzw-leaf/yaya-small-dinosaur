// import Obstacle from './Obstacle'
import Cloud from './Cloud'
// import Game from '.'
import Ground from './Ground'
import Trex from './Trex'

export default class Stage {
  /**
   * Stage config.
   * @enum {number}
   */
  static config = {
    BG_CLOUD_SPEED: 0.2,
    BUMPY_THRESHOLD: 0.3,
    CLOUD_FREQUENCY: 0.5,
    HORIZON_HEIGHT: 16,
    MAX_CLOUDS: 6
  }

  // obstacleList: Obstacle[] = []
  cloudList: Cloud[] = []
  ground: Ground
  tRex: Trex

  /**
   * 初始化游戏舞台，只要云、地面和恐龙，无需障碍物
   */
  constructor(public canvasCtx: CanvasRenderingContext2D) {
    console.log('初始化游戏舞台')
    this.addCould()
    this.ground = new Ground(this.canvasCtx)
    this.tRex = new Trex(this.canvasCtx)
  }

  update(deltaTime: number, currentSpeed: number) {
    this.ground.update(deltaTime, currentSpeed)
    this.updateCloudList(deltaTime, currentSpeed)
  }
  updateCloudList(deltaTime: number, currentSpeed: number) {
    const cloudSpeed = (Stage.config.BG_CLOUD_SPEED / 1000) * deltaTime * currentSpeed
    console.log('云朵的速度', cloudSpeed)

    this.cloudList.forEach(cloud => cloud.updateXPos(currentSpeed))
  }
  addCould() {
    this.cloudList.push(new Cloud(this.canvasCtx))
    console.log('云朵列表', this.cloudList)
  }
}
