import Game from '..'
import Trex from '../sprite/Trex'
import Obstacle from '../sprite/Obstacle'

/**
 * Collision box
 * @param  X X position.
 * @param  Y Y Position.
 * @param WIDTH  Width.
 * @param HEIGHT Height.
 * @constructor
 */
export default class CollisionBox {
  constructor(public role: Trex | Obstacle, public WIDTH: number, public HEIGHT: number) {
    this.draw()
  }
  draw() {
    Game.CANVASCTX.lineWidth = 3
    Game.CANVASCTX.strokeStyle = '#990000'

    Game.CANVASCTX.strokeRect(this.role.X, this.role.Y, this.WIDTH, this.HEIGHT)
  }
}
