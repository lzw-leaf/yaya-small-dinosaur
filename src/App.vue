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
import { Component, Vue, Ref } from 'vue-property-decorator'
import Game from './game'
import ImageSprite from './game/sprite/ImageSprite'
import { eventBus } from '@/utils/eventBus'

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
  onUpdateBackground(matches: boolean) {
    console.log('触发')

    document.documentElement.style.setProperty('--bg-color', matches ? '#000' : '#fff')
  }
  start() {
    console.log('游戏加载')
    this.game = new Game(this.gameCtx, this.config)
    this.setListener()
  }
  setListener() {
    console.log('设置页面监听')
    eventBus.$on('resize', () => this.onResize())
    window.onresize = () => this.onResize()
    const mediaList = window.matchMedia('(prefers-color-scheme:dark)')
    mediaList.onchange = e => eventBus.$emit('alternate', e.matches)
    eventBus.$on('alternate', (matches: boolean) => this.onUpdateBackground(matches))
    eventBus.$emit('alternate', mediaList.matches)
  }
  async mounted() {
    await new ImageSprite()
    this.start()
  }
}
</script>

<style lang="scss">
@import '@/scss/init.scss';
:root {
  --bg-color: #fff;
}
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: var(--bg-color);
  align-items: center;
  justify-content: center;
  .app__game {
    width: 600px;
    height: 150px;
  }
}
</style>
