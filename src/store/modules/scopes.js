export default {
  state: {
    list: [
      /*
      {
        id: 1,
        scope_id_formatted: '00001-01',
        customer_name: 'Igor Huffman',
        customer_home_phone: '420-875-0388',
        customer_address1: '9530 Amet, Ac Ave',
        claim_date: '2022-07-27',
        expected_submission_date: '2022-07-27',
        status: 'active'
      },
      {
        id: 5,
        scope_id_formatted: '00005-01',
        customer_name: 'Kadeem Cannon',
        customer_home_phone: '420-875-0388',
        customer_address1: '758-2461 Nec Ave',
        claim_date: '2022-07-27',
        expected_submission_date: '2022-07-27',
        status: 'progress'
      }
      */
    ]
  },
  getters: {
    getScopes (state) {
      return state.list
    }
  },
  mutations: {
    createScopeList (state, list) {
      state.list = list
    },
    updateScopeList (state, list) {
      state.list = state.list.concat(list)
    },
    saveScopeConfig (state, config) {
      const scope = state.list.find(scope => 1 * scope.id === 1 * this.state.currentScope.id)
      scope.config = config
    },
    addScopePhoto (state, photo) {
      const scope = state.list.find(scope => 1 * scope.id === 1 * this.state.currentScope.id)
      scope.photos.push(photo)
    },
    deleteScopePhoto (state, photoId) {
      const scope = state.list.find(scope => 1 * scope.id === 1 * this.state.currentScope.id)
      scope.photos = scope.photos.filter(
        item => 1 * item.id !== 1 * photoId
      )
    },
    saveScopePhoto (state, photo) {
      const scope = state.list.find(scope => 1 * scope.id === 1 * this.state.currentScope.id)
      if (Array.isArray(scope.photos)) {
        const exist = scope.photos.find(p => 1 * p.id === 1 * photo.id)
        if (exist === undefined) {
          scope.photos.push(photo)
        } else {
          exist.url = photo.url
        }
      } else {
        scope.photos = []
        scope.photos.push(photo)
      }
    }
  },
  actions: {
    setScopeList (context, scopes) {
      context.commit('createScopeList', scopes)
    },
    saveScopeConfig (context, config) {
      context.commit('saveScopeConfig', config)
    },
    saveScopePhoto (context, photo) {
      context.commit('saveScopePhoto', photo)
    },
    addScopePhoto (context, photo) {
      context.commit('addScopePhoto', photo)
    },
    deleteScopePhoto (context, photoId) {
      context.commit('deleteScopePhoto', photoId)
    },
    async createScopeList (context, { limit = 5, page = 0, where = [] }) {
      const post = {
        model: 'api.ScopeIntegration',
        method: 'getScopes',
        params: {
          limit: limit, page: page, where: where, sortfield: '', sortorder: 'asc'
        }
      }

      this.dispatch('ApiCall', post)
        .then((response) => {
          context.commit('createScopeList', response)
        })
    },
    async fetchScopes (context, { limit = 5, page = 0, where = [] }) {
      const post = {
        model: 'api.ScopeIntegration',
        method: 'getScopes',
        params: {
          limit: limit, page: page, where: where, sortfield: '', sortorder: 'asc'
        }
      }

      this.dispatch('ApiCall', post)
        .then((response) => {
          context.commit('updateScopeList', response)
        })
    },
    async setScopeStatus (context, { id, status }) {
      const post = {
        model: 'api.ScopeIntegration',
        method: 'setScopeStatus',
        params: { scopeId: id, status: status }
      }
      this.dispatch('ApiCall', post).then((response) => { })
    }
  }
}
