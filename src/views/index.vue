<template>
  <div class="game">
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

<style lang="scss" scoped></style>
