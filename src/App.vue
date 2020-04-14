<template>
  <div id="app">
    <canvas
      class="app__game"
      :width="config.CANVAS_WIDTH"
      :height="config.CANVAS_HEIGHT"
      ref="gameRef"
      :style="gameCanvasStyle"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import Game from './game'
import ImageSprite from './game/ImageSprite'

@Component
export default class App extends Vue {
  @Ref() readonly gameRef!: HTMLCanvasElement
  game?: Game
  magnification = 1 // 显示倍数

  config = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 300
  }

  get gameCanvasStyle() {
    return { transform: `scale(${this.magnification})` }
  }

  get gameCtx() {
    return this.gameRef.getContext('2d') as CanvasRenderingContext2D
  }

  get status() {
    return this.game?.status
  }
  onResize() {
    this.magnification = window.innerWidth / 600
  }
  start() {
    console.log('游戏加载')
    this.game = new Game(this.gameCtx, this.config)
  }
  async mounted() {
    await new ImageSprite()
    this.start()
    window.onresize = () => this.onResize()
  }
}
</script>

<style lang="scss">
@import '@/scss/init.scss';
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .app__game {
    width: 600px;
    height: 150px;
  }
}
</style>
