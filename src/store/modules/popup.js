export default {
  state: {
    popup: {}
  },
  mutations: {
    setPopup (state, popup) {
      state.popup = popup.popup
    }
  },
  getters: {
    getPopup (state) {
      return state.popup
    }
  },
  actions: {
    setActivePopup (context, popup) {
      context.commit('setPopup', popup)
    },
    closePopup (context) {
      const popup = {
        popup: {
          opened: ''
        }
      }
      context.commit('setPopup', popup)
    }
  }
}
