// import Obstacle from './Obstacle'
// import Cloud from './Cloud'
// import Game from '.'

// export default class Stage {
//   /**
//    * Stage config.
//    * @enum {number}
//    */
//   static config = {
//     BG_CLOUD_SPEED: 0.2,
//     BUMPY_THRESHOLD: 0.3,
//     CLOUD_FREQUENCY: 0.5,
//     HORIZON_HEIGHT: 16,
//     MAX_CLOUDS: 6
//   }

//   obstacleList: Obstacle[] = []
//   cloudList: Cloud[] = []

//   constructor(public canvasCtx: CanvasRenderingContext2D) {}
//   /**
//    * 初始化游戏舞台，只要云、地面和恐龙，无需障碍物
//    */
//   init() {
//     this.addCould()
//     console.log('初始化游戏舞台')
//   }
//   /**
//    * 在舞台上添加一个新的云朵
//    */
//   addCould() {
//     const { CLOUD } = Game.SpriteMap
//     this.cloudList.push(new Cloud(this.canvasCtx))
//   }
// }
