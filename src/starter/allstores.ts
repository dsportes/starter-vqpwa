import { useStarterStore } from '@/starter/store'
import { useStoreDynDoc } from '../demo/doc-store'

// import { useCounterStore } from '../demo/counter'

export default class Stores {
  static dynamicStores = new Map<string, any>()

  static get starter() { return useStarterStore() }

  // static get counter() { return useCounterStore() }

  static getDocStore (svc: string, org: string, noforce?: boolean) : any  {
    const k = svc + '/' + org
    let st = this.dynamicStores.get(k)
    if (!st) {
      if (noforce) return undefined
      const useStore = useStoreDynDoc(k)
      st = useStore()
      this.dynamicStores.set(k, st)
    }
    return st
  }

  static resetDocStores () {
    for(const [,st] of this.dynamicStores) st.reset()
  }
}
