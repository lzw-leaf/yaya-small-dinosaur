// import CollisionBox from './CollisionBox'
// /**
//  * Check for a collision.
//  * @param {!Obstacle} obstacle
//  * @param {!Trex} tRex T-rex object.
//  * @param {HTMLCanvasContext} canvasContext Optional canvas context for drawing
//  *    collision boxes.
//  * @return {Array<CollisionBox>}
//  */
// export function checkForCollision(obstacle, tRex) {
//   const obstacleBoxXPos = CANVAS_WIDTH + obstacle.xPos

//   // Adjustments are made to the bounding box as there is a 1 pixel white
//   // border around the t-rex and obstacles.
//   const tRexBox = new CollisionBox(
//     tRex.xPos + 1,
//     tRex.yPos + 1,
//     tRex.config.WIDTH - 2,
//     tRex.config.HEIGHT - 2
//   )

//   const obstacleBox = new CollisionBox(
//     obstacle.xPos + 1,
//     obstacle.yPos + 1,
//     obstacle.typeConfig.width * obstacle.size - 2,
//     obstacle.typeConfig.height - 2
//   )

//   // Simple outer bounds check.
//   if (boxCompare(tRexBox, obstacleBox)) {
//     const { collisionBoxes } = obstacle
//     const tRexCollisionBoxes = tRex.ducking
//       ? Trex.collisionBoxes.DUCKING
//       : Trex.collisionBoxes.RUNNING

//     // Detailed axis aligned box check.
//     for (let t = 0; t < tRexCollisionBoxes.length; t += 1) {
//       for (let i = 0; i < collisionBoxes.length; i += 1) {
//         // Adjust the box to actual positions.
//         const adjTrexBox = createAdjustedCollisionBox(tRexCollisionBoxes[t], tRexBox)
//         const adjObstacleBox = createAdjustedCollisionBox(collisionBoxes[i], obstacleBox)
//         const crashed = boxCompare(adjTrexBox, adjObstacleBox)

//         if (crashed) {
//           return [adjTrexBox, adjObstacleBox]
//         }
//       }
//     }
//   }
//   return false
// }

// /**
//  * Adjust the collision box.
//  * @param {!CollisionBox} box The original box.
//  * @param {!CollisionBox} adjustment Adjustment box.
//  * @return {CollisionBox} The adjusted collision box object.
//  */
// function createAdjustedCollisionBox(box, adjustment) {
//   return new CollisionBox(
//     box.x + adjustment.x,
//     box.y + adjustment.y,
//     box.width,
//     box.height
//   )
// }

// /**
//  * Compare two collision boxes for a collision.
//  * @param {CollisionBox} tRexBox
//  * @param {CollisionBox} obstacleBox
//  * @return {boolean} Whether the boxes intersected.
//  */
// function boxCompare(tRexBox, obstacleBox) {
//   let crashed = false
//   const tRexBoxX = tRexBox.x
//   const tRexBoxY = tRexBox.y

//   const obstacleBoxX = obstacleBox.x
//   const obstacleBoxY = obstacleBox.y

//   // Axis-Aligned Bounding Box method.
//   if (
//     tRexBox.x < obstacleBoxX + obstacleBox.width &&
//     tRexBox.x + tRexBox.width > obstacleBoxX &&
//     tRexBox.y < obstacleBox.y + obstacleBox.height &&
//     tRexBox.height + tRexBox.y > obstacleBox.y
//   ) {
//     crashed = true
//   }

//   return crashed
// }
