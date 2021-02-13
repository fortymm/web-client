<template>
  <div v-if="displayError(code)">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  inject: ['displayError'],
  props: {
    code: {
      type: String,
      required: true,
    },
  },
})
</script>
