<template>
  <div>
    <NewMatch />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NewMatch from '@/components/matches/NewMatch.vue'
export default Vue.extend({
  components: { NewMatch },
  layout: 'fullscreen',
})
</script>
