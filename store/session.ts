export const state = () => ({
  current: null,
})

export const mutations = {
  signIn(state: any, user: any) {
    state.current = { user }
  },
  signOut(state: any) {
    state.current = null
  },
}
