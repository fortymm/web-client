<template>
  <div class="h-screen w-screen bg-gray-500 flex justify-center items-center">
    <div class="max-w-md w-1/2 bg-white p-6 rounded-lg">
      <form class="grid grid-cols-1 gap-6" @submit.prevent="signUp">
        <div
          v-if="submissionFailed"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative pb-"
          role="alert"
        >
          <span class="block sm:inline">
            There was a problem signing up. Please try again.
          </span>
        </div>

        <div>
          <label for="username-input" class="text-gray-700">Username</label>
          <input
            id="username-input"
            v-model="user.username"
            :disabled="signingUp"
            type="text"
            required
            name="username"
            class="outline-none py-2 border px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label for="email-address-input" class="text-gray-700">
            Email Address
          </label>
          <input
            id="email-address-input"
            v-model="user.emailAddress"
            :disabled="signingUp"
            type="email"
            required
            name="emailAddress"
            class="outline-none py-2 border px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <FieldErrors :errors="errors" source="user/attributes/emailAddress">
            <ErrorMessage code="emailAddressTaken">
              <p class="text-red-500 text-xs italic" role="alert">
                There is already an account with this email address
              </p>
            </ErrorMessage>
          </FieldErrors>
        </div>

        <div>
          <label for="password-input" class="text-gray-700">Password</label>
          <input
            id="password-input"
            v-model="user.password"
            :disabled="signingUp"
            type="password"
            required
            name="password"
            class="outline-none py-2 border px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div class="flex justify-end">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            :disabled="signingUp"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FieldErrors from './FieldErrors.vue'
import ErrorMessage from './ErrorMessage.vue'
export default Vue.extend({
  components: { FieldErrors, ErrorMessage },
  data() {
    return {
      signingUp: false,
      submissionFailed: false,
      errors: [],
      user: {
        username: '',
        password: '',
        emailAddress: '',
      },
    }
  },
  methods: {
    signUp() {
      this.$data.submissionFailed = false
      this.$data.errors = []
      this.$data.signingUp = true
      fetch('https://www.fortymm.com/api/v1/users', {
        method: 'POST',
        body: JSON.stringify({ user: { ...this.$data.user } }),
      })
        .then((response) => {
          this.$data.submissionFailed = false
          if (response.ok || response.status === 422) {
            return response.json()
          }

          return Promise.reject(new Error())
        })
        .then(({ data, errors }) => {
          if (data) {
            this.$emit('user-created', data)
          }

          this.errors = errors || []
        })
        .catch(() => {
          this.$data.submissionFailed = true
        })
        .finally(() => {
          this.$data.signingUp = false
        })
    },
  },
})
</script>
