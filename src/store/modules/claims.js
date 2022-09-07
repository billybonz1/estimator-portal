export default {
  state: {
    list: [],
    canFetch: 1
  },
  getters: {
    getClaims (state) {
      return state.list
    },
    getClaimsItem: (state) => (id) => {
      return state.list.find(claim => 1 * claim.id === 1 * id)
    },
    getCanFetch (state) {
      return state.canFetch
    }
  },
  mutations: {
    createClaimsList (state, list) {
      state.list = list
    },
    updateClaimsList (state, list) {
      state.list = state.list.concat(list)
      state.canFetch = 1
    },
    changeCanFetch (state, bool) {
      state.canFetch = bool
    },
    updateClaimScopes (state, data) {
      const listItem = state.list.find(claim => 1 * claim.id === 1 * data.id)
      listItem.hasScopes = 1
      listItem.scopesList = data.response
    }
  },
  actions: {
    setClaimList (context, claims) {
      context.commit('createClaimsList', claims)
    },
    async getClaimScopes (context, { id = 0, limit = 0, page = 0, where = [] }) {
      where.claim_id = id
      const post = {
        model: 'api.ScopeIntegration',
        method: 'getScopes',
        params: {
          limit: limit, page: page, where: where, sortfield: 'created_on', sortorder: 'desc'
        }
      }
      this.dispatch('ApiCall', post)
        .then((response) => {
          context.commit('updateClaimScopes', { id, response })
        })
    },
    async createClaimsList (context, { limit = 5, page = 0, where = [] }) {
      const post = {
        model: 'api.ClaimIntegration',
        method: 'getClaims',
        params: {
          limit: limit, page: page, where: where, sortfield: 'created_on', sortorder: 'desc'
        }
      }

      this.dispatch('ApiCall', post)
        .then((response) => {
          context.commit('createClaimsList', response)
        })
    },
    async fetchClaims (context, { limit = 5, page = 0, where = [] }) {
      const post = {
        model: 'api.ClaimIntegration',
        method: 'getClaims',
        params: {
          limit: limit, page: page, where: where, sortfield: 'created_on', sortorder: 'desc'
        }
      }

      this.dispatch('ApiCall', post)
        .then((response) => {
          context.commit('updateClaimsList', response)
        })
    },
    async saveScopes (context, data) {
      const post = {
        model: 'api.ClaimIntegration',
        method: 'saveScopes',
        params: {
          data: JSON.stringify(data)
        }
      }

      this.dispatch('ApiCall', post)
        .then((response) => {
          this.dispatch('getClaimScopes', { id: data.data.data.claim_id, limit: 1000, page: 0, where: data.data.data.filters })
        })
    },
    changeCanFetch (context, bool) {
      context.commit('changeCanFetch', bool)
    }
  },
  modules: {
  }
}
