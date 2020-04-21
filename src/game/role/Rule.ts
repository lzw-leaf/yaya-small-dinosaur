import Obstacle from '../sprite/Obstacle'
import CollisionBox from './CollisionBox'
import { eventBus } from '@/utils/eventBus'

export default class Rule {
  detectCollision(trexBox: CollisionBox, obstacleBox: CollisionBox) {
    console.log('tREX  X', trexBox.X, trexBox.X + trexBox.WIDTH)
    console.log('Obstacle  X', obstacleBox.X, obstacleBox.X + obstacleBox.WIDTH)
    console.log('tREX  Y', trexBox.Y, trexBox.Y + trexBox.HEIGHT)
    console.log('Obstacle  Y', obstacleBox.Y, obstacleBox.Y + obstacleBox.HEIGHT)
    if (
      trexBox.X + trexBox.WIDTH >= obstacleBox.X &&
      trexBox.X <= obstacleBox.X + obstacleBox.WIDTH &&
      trexBox.Y + trexBox.HEIGHT >= obstacleBox.Y &&
      trexBox.Y <= obstacleBox.Y + obstacleBox.HEIGHT
    ) {
      eventBus.$emit('crashed')
    }
  }
}
