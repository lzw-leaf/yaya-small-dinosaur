class RunTime {
  private FPS = 120

  getFPS() {
    return this.FPS
  }

  setFPS(fps: number) {
    this.FPS = fps
  }
}
const runTime = new RunTime()
export default runTime
