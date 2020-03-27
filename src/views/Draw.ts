import {appendAsyncConstructor} from 'async-constructor'

// 剩余参数入参定义
export type drawValue = [number, number, number, number, number, number, number, number]
export default class Draw {
  spriteImage: HTMLImageElement = new Image() //精灵图的图片对象
  width = 0 //精灵图的图片宽度
  height = 0 //精灵图的图片高度

  constructor() {
    console.log('开始实例化')
    this.spriteImage.src = 'sprite.png'
    appendAsyncConstructor(this, async () => {
      console.log('开始加载精灵图')
      await this.verifyLoadedImage()
      console.log('加载完毕')
      this.width = this.spriteImage.naturalWidth
      this.height = this.spriteImage.naturalHeight
    })
  }

  draw(cxt: CanvasRenderingContext2D, ...drawValueList: drawValue) {
    cxt.drawImage(this.spriteImage, ...drawValueList)
  }
  private verifyLoadedImage() {
    return new Promise((resolve, reject) => {
      let ms = 0
      this.spriteImage.complete && resolve(true)
      setInterval(() => {
        ms += 50
        this.spriteImage.complete && resolve(true)
        ms > 4000 && reject('加载超时')
      }, 50)
    })
  }
}
