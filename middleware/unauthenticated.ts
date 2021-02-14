import { Context } from '@nuxt/types'

export default function ({ store, redirect }: Context) {
  if (store.state.currentSession) {
    return redirect('/')
  }
}
