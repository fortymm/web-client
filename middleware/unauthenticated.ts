import { Context } from '@nuxt/types'

export default function ({ store, redirect }: Context) {
  if (store.state.session.current) {
    return redirect('/')
  }
}
