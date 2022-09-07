export default {
  state: {
    list: []
  },
  getters: {
    getNotes (state) {
      return state.notes
    }
  },
  mutations: {
    createNotesList (state, list) {
      state.notes = list
    }
  },
  actions: {
    async createNotesList (context) {
      const post = {
        model: 'api.NotesIntegration',
        method: 'getNotes',
        params: {}
      }

      this.dispatch('ApiCall', post)
        .then((response) => {
          console.log(response)
          context.commit('createNotesList', response)
        })
    }
  },
  modules: {
  }
}
