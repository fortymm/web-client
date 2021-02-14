<template>
  <div class="flex items-center">
    <template v-if="!signedIn">
      <NuxtLink
        to="sign-up"
        class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        Sign Up
      </NuxtLink>
    </template>

    <template v-if="!signedIn">
      <NuxtLink
        to="sign-in"
        class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        Sign In
      </NuxtLink>
    </template>

    <div
      v-if="signedIn"
      class="cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      @click="signOut"
    >
      Sign Out
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
export default Vue.extend({
  computed: {
    signedIn() {
      return this.$store.state.session.current
    },
  },
  methods: {
    ...mapMutations({ signOut: 'session/signOut' }),
  },
})
</script>
