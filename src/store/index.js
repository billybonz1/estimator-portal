import { createStore } from 'vuex'
import API from './modules/api'
import Scopes from './modules/scopes'
import Claims from './modules/claims'
import Notes from './modules/notes'
import Gallery from './modules/gallery'
import Popup from './modules/popup'
import Auth from './modules/auth'
import Menu from './modules/menu'
import Dictionaries from './modules/dictionaries'
import Config from './modules/config'
import router from '@/router'

export default createStore({
  state: {
    mode: 'dev', // production / dev
    apiURL: 'https://jobs-dev.evogence.com/das-json.php',
    apiURL_production: 'https://jobs.apexdki.com/das-json.php',
    currentScope: {},
    currentClaim: {}
  },
  getters: {
    getApiUrl (state) {
      return state.mode === 'production' ? state.apiURL_production : state.apiURL
    },
    getCurrentScope (state) {
      // redirect to home page
      if (state.currentScope.id === undefined) {
        router.push({ name: 'home' })
      }

      // page config
      if (typeof state.currentScope.config === 'string') {
        try {
          state.currentScope.config = JSON.parse(state.currentScope.config)
        } catch (e) {
          state.currentScope.config = {}
        }
      }
      if (state.currentScope.config === null) {
        state.currentScope.config = {}
      }
      return state.currentScope
    },
    getCurrentClaim (state) {
      // redirect to home page
      if (state.currentClaim === undefined || state.currentClaim.id === undefined) {
        router.push({ name: 'home' })
      }
      return state.currentClaim
    },
    getScopeItem: (state, getters) => (id) => {
      const claims = getters.getClaims

      let scope = ''
      claims.forEach((claim) => {
        if (scope === '' && Array.isArray(claim.scopesList)) {
          scope = claim.scopesList.find(scope => 1 * scope.id === 1 * id)

          if (scope !== undefined && scope.id !== undefined) {
            return true
          } else {
            scope = ''
          }
        }
      })
      return scope
    },
    getClaimItem: (state, getters) => (id) => {
      return getters.getClaims.find(claim => 1 * claim.id === 1 * id)
    }
  },
  mutations: {
    setCurrentScope (state, scope) {
      state.currentScope = scope

      try {
        if (typeof state.currentScope.config !== 'object') {
          state.currentScope.config = JSON.parse(state.currentScope.config)
        }
      } catch (e) {
        state.currentScope.config = {}
      }

      localStorage.setItem('currentScopeId', state.currentScope.id)

      this.dispatch('loadConfig', state.currentScope.config)
      this.dispatch('setScopeList', [scope])
    },
    setCurrentClaim (state, claim) {
      state.currentClaim = claim

      localStorage.setItem('currentClaimId', state.currentClaim.id)
    },
    setupCurrentScope (state) {
      // try to get from local storage
      if (localStorage.getItem('currentScopeId') && (state.currentScope === undefined || state.currentScope.id === undefined)) {
        try {
          const id = localStorage.getItem('currentScopeId')
          if (id !== undefined) {
            const scope = this.getters.getScopeItem(id)
            if (scope !== undefined && scope.id !== undefined) {
              this.dispatch('setCurrentScope', scope)
            }
          }
        } catch (e) {}
      }
    }
  },
  actions: {
    setCurrentScope (context, id) {
      context.commit('setCurrentScope', this.getters.getScopeItem(id))
    },
    setCurrentClaim (context, id) {
      context.commit('setCurrentClaim', this.getters.getClaimItem(id))
    },
    setupCurrentScope (context) {
      context.commit('setupCurrentScope')
    }
  },
  modules: {
    API,
    Scopes,
    Claims,
    Notes,
    Auth,
    Menu,
    Dictionaries,
    Popup,
    Config,
    Gallery
  }
})
