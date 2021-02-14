<template>
  <SignInForm @session-created="redirectToTheLandingPage" />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import SignInForm from '@/components/SignInForm.vue'
export default Vue.extend({
  components: {
    SignInForm,
  },
  layout: 'centered',
  middleware: 'unauthenticated',
  methods: {
    redirectToTheLandingPage(event: any) {
      this.signIn(event)
      this.$router.push('/')
    },
    ...mapMutations({ signIn: 'session/signIn' }),
  },
})
</script>
