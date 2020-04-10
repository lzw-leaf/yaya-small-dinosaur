<template>
  <div id="app">
    <canvas width="600" height="150" ref="gameRef" :style="gameCanvasStyle"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import Game from './game'

@Component
export default class App extends Vue {
  @Ref() readonly gameRef!: HTMLCanvasElement
  game?: Game // 显示倍数
  magnification = 1

  config = {
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 150
  }

  get gameCanvasStyle() {
    return { transform: `scale(${this.magnification})` }
  }

  get gameCtx() {
    return this.gameRef.getContext('2d') as CanvasRenderingContext2D
  }

  start() {
    console.log('游戏加载')
    window.game = new Game(this.gameCtx, this.config)
    window.game.init()
  }
  async mounted() {
    this.start()
    window.onresize = () => (this.magnification = window.innerWidth / 600)
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
}
</style>
