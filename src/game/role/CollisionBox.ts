// import Game from '..'

/**
 * Collision box
 * @param  X X position.
 * @param  Y Y Position.
 * @param WIDTH  Width.
 * @param HEIGHT Height.
 * @constructor
 */
export default class CollisionBox {
  constructor(
    public X: number,
    public Y: number,
    public WIDTH: number,
    public HEIGHT: number
  ) {
    // this.draw()
  }
  // draw(canvasCtx: CanvasRenderingContext2D) {
  //   canvasCtx.lineWidth = 3
  //   canvasCtx.strokeStyle = '#990000'
  //   canvasCtx.strokeRect(this.X, this.Y, this.WIDTH, this.HEIGHT)
  // }
  /**
   * 设置盒子体积
   * @param width
   * @param height
   */
  // setDimensions(width: number, height: number) {}

  /**
   * 设置盒子坐标
   * @param X
   * @param Y
   */
  setPosition(X: number, Y: number) {
    this.X = X
    this.Y = Y
  }
}
