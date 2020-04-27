// import Obstacle from './Obstacle'
import Cloud from '../sprite/Cloud'
import Ground from '../sprite/Ground'
import Game from '..'
import Moon from '../sprite/Moon'
import Star from '../sprite/star'
import { eventBus } from '@/utils/eventBus'
import { getRandomNum } from '@/utils'
import Obstacle from '../sprite/Obstacle'
import DistanceMeter from './DistanceMeter'

export default class Stage {
  /**
   * Stage config.
   * @enum {number}
   */
  static config = {
    ALTERNATE_TIME: 30000,
    BG_CLOUD_SPEED: 1,
    BUMPY_THRESHOLD: 0.3,
    CLOUD_FREQUENCY: 0.5, //控制云的随机出现
    MAX_STAR: 8, //星星最大数量
    MAX_CLOUDS: 6 //云朵最大数量
  }

  static isNight = true

  moon: Moon
  starList: Star[] = []
  // 星体配置
  astralSpeed = Game.config.CANVAS_WIDTH / Stage.config.ALTERNATE_TIME

  cloudList: Cloud[] = []
  ground: Ground
  obstacleList: Obstacle[] = []

  /**
   * 初始化游戏舞台
   */
  constructor(public canvasCtx: CanvasRenderingContext2D) {
    this.ground = new Ground(this.canvasCtx)
    this.moon = new Moon(this.canvasCtx)
    eventBus.$on('alternate', (matches: boolean) => (Stage.isNight = matches))
  }

  init() {
    console.log('初始化游戏舞台')
    if (Stage.isNight) {
      this.generateStarList()
      this.moon.update(0, 0)
    }
  }

  update(deltaTime: number) {
    this.ground.update(deltaTime)
    this.updateMoonAndStar(deltaTime)
    this.updateCloudList(deltaTime)
    DistanceMeter.currentMaxScore > 30 && this.updateObstacleList(deltaTime)
  }

  updateMoonAndStar(deltaTime: number) {
    const speed = this.astralSpeed * deltaTime
    this.updateStarList(speed)
    this.moon.update(deltaTime, speed)
  }
  updateStarList(speed: number) {
    this.starList.forEach(star => star.update(speed))

    this.starList.length || this.addCould()
    const starCount = this.starList.length

    const { MAX_STAR } = Stage.config
    // 初始化用
    const lastStar = this.starList[starCount - 1] || { X: 0 }
    if (
      Math.random() < 0.5 &&
      lastStar.X < Game.config.CANVAS_WIDTH - Star.config.MIN_GAD &&
      starCount < MAX_STAR
    ) {
      this.starList.push(new Star(this.canvasCtx))
    }
    this.starList = this.starList.filter(star => !star.isHide)
  }

  updateObstacleList(deltaTime: number) {
    this.obstacleList.forEach(obstacle => obstacle.update(deltaTime))
    this.obstacleList.length || this.obstacleList.push(new Obstacle(this.canvasCtx))
    const obstacleCount = this.obstacleList.length

    // 随机生成障碍物
    const lastObstacle = this.obstacleList[obstacleCount - 1]
    const { CANVAS_WIDTH } = Game.config

    if (CANVAS_WIDTH - lastObstacle.X > lastObstacle.gap && Math.random() > 0.9) {
      this.obstacleList.push(new Obstacle(this.canvasCtx))
    }
    this.obstacleList = this.obstacleList.filter(obstacle => !obstacle.isHide)
  }
  updateCloudList(deltaTime: number) {
    // 执行过程产生的时间*每毫秒的云基础速度*当前速度
    const cloudSpeed =
      (Stage.config.BG_CLOUD_SPEED / 1000) * deltaTime * Game.currentSpeed
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

  // 初始化使用
  generateStarList() {
    let length = this.starList.length
    while (length < Stage.config.MAX_STAR) {
      const X = getRandomNum(0, Game.config.CANVAS_WIDTH)
      Math.random() < 0.5 && this.starList.push(new Star(this.canvasCtx, X))
      length++
    }
  }
  addCould() {
    this.cloudList.push(new Cloud(this.canvasCtx))
  }

  reSet() {
    this.obstacleList = []
    this.starList = []
    this.init()
  }
}
