<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface Error {
  source: string
  code: string
}

interface Props {
  errors: Array<Error>
  source: string
}

interface Computed {
  errorCodes: Set<string>
}

export default Vue.extend<Vue, Props, Computed, {}>({
  provide() {
    return {
      displayError: (code: string): boolean => {
        return this.errorCodes.has(code)
      },
    }
  },
  props: {
    errors: {
      type: Array,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
  },
  computed: {
    errorCodes() {
      return new Set(
        this.$props.errors
          .filter((error: any) => error.source === this.$props.source)
          .map((error: any) => error.code)
      )
    },
  },
})
</script>
