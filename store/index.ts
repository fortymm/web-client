export const state = () => ({
  currentSession: null,
})

export const mutations = {
  signIn(state: any, user: any) {
    state.currentSession = { user }
  },
}
