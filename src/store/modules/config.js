export default {
  state: {
    config: {

    }
  },
  getters: {
    getConfig (state) {
      return state.config
    },
    getComponentConfig: (state) => (component) => {
      if (state.config === undefined || state.config === null) {
        state.config = {}
      }
      if (state.config[component] === undefined) {
        state.config[component] = {}
      }
      return state.config[component]
    },
    isCompleteComponent: (state) => (component) => {
      if (state.config === undefined || state.config === null) {
        state.config = {}
      }
      if (state.config.ComponentMenu === undefined) {
        return false
      }
      return state.config.ComponentMenu[component] !== undefined ? state.config.ComponentMenu[component] : false
    }
  },
  mutations: {
    loadConfig (state, config) {
      state.config = config
    },
    setComponentValue (state, { component, value }) {
      state.config[component] = value
    },
    setupComponent (state, { component, setup }) {
      state.config[component] = setup

      this.dispatch('saveScopeConfig', state.config)
    },
    saveConfig (state) {
      const post = {
        model: 'api.ScopeIntegration',
        method: 'saveScopeConfig',
        params: {
          scopeId: this.state.currentScope.id,
          config: JSON.stringify(state.config)
        }
      }

      this.dispatch('ApiCall', post).then((response) => {

      })
    },
    setCompleteStep (state, component) {
      if (state.config.ComponentMenu === undefined) {
        state.config.ComponentMenu = {}
      }
      state.config.ComponentMenu[component] = true
    }
  },
  actions: {
    loadConfig (context, config) {
      context.commit('loadConfig', config)
    },
    setupComponent (context, { component, setup }) {
      context.commit('setupComponent', { component, setup })
    },
    saveConfig (context) {
      context.commit('saveConfig')
    },
    setComponentValue (context, { component, value }) {
      context.commit('setComponentValue', { component, value })
    },
    setCompleteStep (context, component) {
      context.commit('setCompleteStep', component)
    }
  }
}
