class ImageSprite {
  image: HTMLImageElement = new Image()
  constructor() {
    console.log('开始实例化')
    this.image.src = 'sprite.png'
  }

  load() {
    return new Promise((resolve, reject) => {
      this.image.onload = () => resolve()
      this.image.onerror = () => reject()
    })
  }
}
const sprite = new ImageSprite()
export default sprite