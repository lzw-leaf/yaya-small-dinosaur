export default class Runner {
  static CANVAS_WIDTH = 600
  static CANVAS_HEIGHT = 150
  static _instance: Runner

  currentSpeed = 0
  constructor() {
    // Singleton
    if (Runner._instance) {
      return Runner._instance
    }
    Runner._instance = this
  }
}
