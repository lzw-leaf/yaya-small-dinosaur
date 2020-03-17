<template>
  <div class="game" :style="isDark">
    <ground></ground>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

@Component({
  components: {
    ground: () => import('@/components/ground.vue')
  }
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.game {
  width: 100vw;
  height: 100vh;
}
</style>
