<template>
  <SignUpForm @user-created="redirectToTheLandingPage" />
</template>

<script lang="ts">
import Vue from 'vue'
import SignUpForm from '@/components/SignUpForm.vue'
import { mapMutations } from 'vuex'
export default Vue.extend({
  components: {
    SignUpForm,
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
