import Vue, { VNode } from 'vue'
// import Game from '@/views/game'
declare global {
  // interface Window {
  // game: Game
  // }
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
