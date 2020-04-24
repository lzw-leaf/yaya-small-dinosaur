import Obstacle from '../sprite/Obstacle'
import CollisionBox from './CollisionBox'
import { eventBus } from '@/utils/eventBus'

export default class Rule {
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
  detectCollisionList(trexBoxs: CollisionBox[], obstacleBoxs: CollisionBox[]) {
    trexBoxs.forEach(trexBox => {
      obstacleBoxs.forEach(obBox => {
        this.detectCollision(trexBox, obBox)
      })
    })
  }
}
