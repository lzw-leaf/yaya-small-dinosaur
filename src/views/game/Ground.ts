// import runTime from '@/utils/runTime'
import imageSprite from './ImageSprite'
import {Sprite} from './types'

export default class Ground {
  /**
   * Ground config.
   * @enum {number}
   */
  static config = {
    WIDTH: 600,
    HEIGHT: 12,
    YPOS: 127
  }
  sourceDimensions: object = {}
  dimensions = Ground.config

  constructor(public canvasCtx: CanvasRenderingContext2D, public sprite: Sprite) {
    // this.sourceDimensions = {}
    // this.sourceXPosList = [this.spritePos.x, this.spritePos.x + this.dimensions.WIDTH]
    // this.xPos = []
    // this.yPos = 0
    // this.bumpThreshold = 0.5
    // this.setSourceDimensions()
    // this.draw()
  }

  /**
   * Draw the horizon line.
   */
  // draw() {
  //   this.canvasCtx.drawImage(
  //     imageSprite.image,
  //     this.sourceXPos[0],
  //     this.spritePos.y,
  //     this.sourceDimensions.WIDTH,
  //     this.sourceDimensions.HEIGHT,
  //     this.xPos[0],
  //     this.yPos,
  //     this.dimensions.WIDTH,
  //     this.dimensions.HEIGHT
  //   )

  //   this.canvasCtx.drawImage(
  //     getImageSprite(),
  //     this.sourceXPos[1],
  //     this.spritePos.y,
  //     this.sourceDimensions.WIDTH,
  //     this.sourceDimensions.HEIGHT,
  //     this.xPos[1],
  //     this.yPos,
  //     this.dimensions.WIDTH,
  //     this.dimensions.HEIGHT
  //   )
  // }
}
