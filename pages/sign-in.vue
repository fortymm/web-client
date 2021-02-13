<template>
  <SignInForm @session-created="redirectToTheLandingPage" />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    redirectToTheLandingPage() {
      this.$router.push('/')
    },
  },
})
</script>
