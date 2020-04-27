import CollisionBox from './CollisionBox'
import { eventBus } from '@/utils/eventBus'
import ImageSprite from '../sprite/ImageSprite'
import Game from '..'

export default class Rule {
  static textSprite = { X: 1294, Y: 26, WIDTH: 384, HEIGHT: 24 }
  static buttonSprite = { X: 2, Y: 2, WIDTH: 72, HEIGHT: 64 }
  /**
   *
   * @param trexBox 小恐龙盒子
   * @param obstacleBox 障碍物盒子
   */
  detectCollision(trexBox: CollisionBox, obstacleBox: CollisionBox) {
    if (
      trexBox.X + trexBox.WIDTH >= obstacleBox.X &&
      trexBox.X <= obstacleBox.X + obstacleBox.WIDTH &&
      trexBox.Y + trexBox.HEIGHT >= obstacleBox.Y &&
      trexBox.Y <= obstacleBox.Y + obstacleBox.HEIGHT
    ) {
      eventBus.$emit('crashed')
    }
  }

  /**
   *
   * @param trexBoxs 小恐龙盒子列表
   * @param obstacleBoxs 障碍物盒子列表
   */
  detectCollisionList(trexBoxs: CollisionBox[], obstacleBoxs: CollisionBox[]) {
    trexBoxs.forEach(trexBox => {
      obstacleBoxs.forEach(obBox => {
        this.detectCollision(trexBox, obBox)
      })
    })
  }

  gameOver(canvasCtx: CanvasRenderingContext2D) {
    const { CANVAS_WIDTH, CANVAS_HEIGHT } = Game.config
    const { textSprite, buttonSprite } = Rule
    canvasCtx.drawImage(
      ImageSprite.image,
      textSprite.X,
      textSprite.Y,
      textSprite.WIDTH,
      textSprite.HEIGHT,
      CANVAS_WIDTH / 2 - textSprite.WIDTH / 2,
      CANVAS_HEIGHT / 2 - textSprite.HEIGHT / 2 - buttonSprite.WIDTH,
      textSprite.WIDTH,
      textSprite.HEIGHT
    )
    canvasCtx.drawImage(
      ImageSprite.image,
      buttonSprite.X,
      buttonSprite.Y,
      Rule.buttonSprite.WIDTH,
      Rule.buttonSprite.HEIGHT,
      CANVAS_WIDTH / 2 - buttonSprite.WIDTH / 2,
      CANVAS_HEIGHT / 2 - textSprite.HEIGHT / 2,
      buttonSprite.WIDTH,
      buttonSprite.HEIGHT
    )
  }
}
