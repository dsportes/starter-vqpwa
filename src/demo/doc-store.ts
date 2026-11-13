import { reactive } from 'vue'
import { defineStore } from 'pinia'

/* id est de la forme 'svc/org'
Créé un store par couple svc/org hébergeant des 'docs',
chacun identifié par une id (nom de la propriété dans docs.
*/

export const useStoreDynDoc = (id: string) => defineStore(`store-${id}`, () => {

    /* State *********************************************/
    const svc = id.substring(0, id.indexOf('/'))
    const org = id.substring(id.indexOf('/') + 1)

    let docs = reactive({  } as any)

    const getDoc = (idd: string) => {
      return docs[idd] || { title: 'Fake '}
    }

    const reset = () => {
      for(const id in docs) delete docs[id]
    }

    return {
      reset, getDoc, docs
    }
  })
