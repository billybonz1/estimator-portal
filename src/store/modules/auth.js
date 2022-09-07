import cookie from 'vue-cookies'

export default {
  state: {
    currentUser: {
      authenticated: false
    }
  },
  getters: {
    getCurrentUser (state) {
      if (state.currentUser.authenticated === false) {
        try {
          const CookieUser = cookie.get('user')
          if (CookieUser !== undefined && CookieUser.authenticated) {
            state.currentUser = CookieUser
          }
        } catch (e) {}
      }
      return state.currentUser
    }
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
      cookie.set('user', user)
    }
  },
  actions: {
    async login (context, { email, password, loginType }) {
      const post = {
        model: 'api.UserIntegration',
        method: 'Authorize',
        params: {
          login: email, password: password, loginType: loginType
        }
      }

      await this.dispatch('ApiCall', post)
        .then((response) => {
          if (response.id !== undefined && response.firstname !== undefined && response.lastname !== undefined) {
            context.commit('setCurrentUser', {
              authenticated: true,
              id: response.id,
              login: response.login,
              email: response.email,
              firstname: response.firstname,
              lastname: response.lastname,
              skills: response.skills
            })
          } else {
            throw new Error('Incorrect login or password.')
          }
        })
    },

    async logout (context) {
      context.commit('setCurrentUser', {
        authenticated: false
      })
    }
  }
}
