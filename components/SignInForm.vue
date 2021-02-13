<template>
  <div class="h-screen w-screen bg-gray-500 flex justify-center items-center">
    <div class="max-w-md w-1/2 bg-white p-6 rounded-lg">
      <form class="grid grid-cols-1 gap-6" @submit.prevent="signIn">
        <div
          v-if="submissionFailed"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative pb-"
          role="alert"
        >
          <span class="block sm:inline">
            There was a problem signing in. Please try again.
          </span>
        </div>

        <div
          v-if="signInFailed"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative pb-"
          role="alert"
        >
          <span class="block sm:inline">
            Invalid email address or password.
          </span>
        </div>

        <div>
          <label for="email-address-input" class="text-gray-700">
            Email Address
          </label>
          <input
            id="email-address-input"
            v-model="credentials.emailAddress"
            :disabled="signingIn"
            type="email"
            required
            name="emailAddress"
            class="outline-none py-2 border px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label for="password-input" class="text-gray-700">Password</label>
          <input
            id="password-input"
            v-model="credentials.password"
            :disabled="signingIn"
            type="password"
            required
            name="password"
            class="outline-none py-2 border px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div class="flex justify-end">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            :disabled="signingIn"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      signingIn: false,
      submissionFailed: false,
      signInFailed: false,
      credentials: {
        emailAddress: '',
        password: '',
      },
    }
  },
  methods: {
    async signIn() {
      this.$data.submissionFailed = false
      this.$data.signInFailed = false
      this.$data.signingIn = true

      try {
        const signInRequest = await fetch(
          'https://www.fortymm.com/api/v1/sessions',
          {
            method: 'POST',
            body: JSON.stringify({
              credentials: { ...this.$data.credentials },
            }),
          }
        )

        if (signInRequest.status === 422) {
          this.$data.signInFailed = true
        } else if (signInRequest.ok) {
          const { data } = await signInRequest.json()
          this.$emit('session-created', data)
        } else {
          this.$data.submissionFailed = true
        }
      } catch {
        this.$data.submissionFailed = true
      }

      this.$data.signingIn = false
    },
  },
})
</script>
