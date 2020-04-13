import { appendAsyncConstructor } from 'async-constructor'
export default class ImageSprite {
  static image: HTMLImageElement = new Image()

  constructor() {
    console.log('开始实例化')
    ImageSprite.image.src = 'sprite.png'
    appendAsyncConstructor(this, async () => {
      await new Promise((resolve, reject) => {
        ImageSprite.image.onload = () => resolve()
        ImageSprite.image.onerror = () => reject()
      })
    })
  }
}
