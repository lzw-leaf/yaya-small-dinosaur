<template>
  <div class="game">
    <canvas width="600" height="150" ref="Game" :style="gameCanvasStyle"></canvas>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Ref} from 'vue-property-decorator'
import {State, Mutation} from 'vuex-class'
import Draw, {drawValue} from './Draw'
@Component({
  components: {
    // ground: () => import('@/components/ground.vue')
  }
})
export default class Game extends Vue {
  @Ref() readonly Game!: HTMLCanvasElement
  @State('draw') draw!: Draw
  @Mutation('setDraw') setDraw!: Function
  // 显示倍数
  magnification = 1

  // 地面渲染
  ground = {
    sparePoint: 0,
    base: [0, 100, 600, 138],
    mound: [2090, 100, 100, 138],
    burrow: [1450, 100, 120, 138]
  }

  // 得分
  score = 0
  // 步伐
  step = 3
  beforLevelScore = 0

  get gameCanvasStyle() {
    return {transform: `scale(${this.magnification})`}
  }
  get gameCtx() {
    return this.Game.getContext('2d') as CanvasRenderingContext2D
  }

  drawClockCanvas() {
    const now = new Date()
    const ctx = this.Game.getContext('2d') as CanvasRenderingContext2D
    ctx.save()
    ctx.clearRect(0, 0, 150, 150)
    ctx.translate(75, 75)
    ctx.scale(0.4, 0.4)
    ctx.rotate(-Math.PI / 2)
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'white'
    ctx.lineWidth = 8
    ctx.lineCap = 'round'

    // Hour marks
    ctx.save()
    for (let i = 0; i < 12; i++) {
      ctx.beginPath()
      ctx.rotate(Math.PI / 6)
      ctx.moveTo(100, 0)
      ctx.lineTo(120, 0)
      ctx.stroke()
    }
    ctx.restore()

    // Minute marks
    ctx.save()
    ctx.lineWidth = 5
    for (let i = 0; i < 60; i++) {
      if (i % 5 != 0) {
        ctx.beginPath()
        ctx.moveTo(117, 0)
        ctx.lineTo(120, 0)
        ctx.stroke()
      }
      ctx.rotate(Math.PI / 30)
    }
    ctx.restore()

    const sec = now.getSeconds()
    const min = now.getMinutes()
    let hr = now.getHours()
    hr = hr >= 12 ? hr - 12 : hr

    ctx.fillStyle = 'black'

    // write Minutes
    ctx.save()
    ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec)
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.moveTo(-28, 0)
    ctx.lineTo(112, 0)
    ctx.stroke()
    ctx.restore()

    // Write seconds
    ctx.save()
    ctx.rotate((sec * Math.PI) / 30)
    ctx.strokeStyle = '#D40000'
    ctx.fillStyle = '#D40000'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(-30, 0)
    ctx.lineTo(83, 0)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, 10, 0, Math.PI * 2, true)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(95, 0, 10, 0, Math.PI * 2, true)
    ctx.stroke()
    ctx.fillStyle = 'rgba(0,0,0,0)'
    ctx.arc(0, 0, 3, 0, Math.PI * 2, true)
    ctx.fill()
    ctx.restore()

    // write Hours
    ctx.save()
    ctx.rotate(hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) * sec)
    ctx.lineWidth = 14
    ctx.beginPath()
    ctx.moveTo(-20, 0)
    ctx.lineTo(80, 0)
    ctx.stroke()
    ctx.restore()

    ctx.beginPath()
    ctx.lineWidth = 14
    ctx.strokeStyle = '#325FA2'
    ctx.arc(0, 0, 142, 0, Math.PI * 2, true)
    ctx.stroke()

    ctx.restore()

    window.requestAnimationFrame(this.drawGameCanvas)
  }
  drawGameCanvas() {
    this.gameCtx.save()
    window.requestAnimationFrame(this.drawGameCanvas)
  }

  calculationScore() {
    // console.log('得分', this.score)
    console.log('步数', this.step)
    if (this.score > this.beforLevelScore + this.step * 400) {
      this.step += 1
      this.beforLevelScore = this.score
      console.log('进入下一等级')
    }

    this.score += this.step
  }

  drawGroundCanvas() {
    this.gameCtx.save()
    this.gameCtx.clearRect(0, 0, 600, 150)
    this.calculationScore()

    const remainWidth = this.draw.width - this.ground.base[0]

    const prop = [...this.ground.base, ...[0, 100, 600, 138]] as drawValue
    const [sx, sy, , sh] = this.ground.base
    if (remainWidth < 0) {
      console.log('归一条件')
      this.ground.base[0] = this.ground.sparePoint
      this.ground.sparePoint = 0
      this.draw.draw(this.gameCtx, this.ground.base[0], sy, 600, sh, 0, 100, 600, 138)
    } else if (remainWidth < this.Game.width) {
      console.log(
        '进入两图条件',
        sx + remainWidth,
        remainWidth,
        600 - remainWidth,
        this.ground.base[0]
      )
      this.gameCtx.save()
      this.draw.draw(
        this.gameCtx,
        ...([sx, 100, remainWidth, sh, 0, 100, remainWidth, 138] as drawValue)
      )
      // // 增加连接线，解决延迟导致的空白
      // this.draw.draw(
      //   this.gameCtx,
      //   ...([30, 100, 50, 138, remainWidth - 48, 100, 50, 138] as drawValue)
      // )
      this.gameCtx.restore()
      this.draw.draw(
        this.gameCtx,
        this.ground.sparePoint,
        sy,
        600 - remainWidth,
        sh,
        remainWidth,
        100,
        600 - remainWidth,
        138
      )
    } else {
      this.draw.draw(this.gameCtx, ...prop)
    }

    this.gameCtx.restore()
    this.ground.base[0] += this.step
    window.requestAnimationFrame(this.drawGroundCanvas)
  }
  start() {
    console.log('游戏开始')
    window.requestAnimationFrame(this.drawGroundCanvas)
  }
  async mounted() {
    const draw = await new Draw()
    this.setDraw(draw)
    this.start()
    window.onresize = () => {
      this.magnification = window.innerWidth / 600
    }
  }
}
</script>

<style lang="scss" scoped>
.game {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
