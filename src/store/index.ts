import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    draw: null
  },
  mutations: {
    setDraw(state, draw) {
      state.draw = draw
    }
  },
  actions: {},
  modules: {}
})
