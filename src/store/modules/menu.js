import router from '@/router/index.js'

export default {
  state: {
    menu: [
      {
        step: 1,
        title: 'Overview',
        is_active: true,
        done: false,
        required: true,
        view: 'ScopeBuild',
        is_active_route: false,
        sub_steps: [
          { step: 1, view: 'ScopeBuild', title: 'Select Roof Type', is_active: true, done: false, is_active_route: false },
          { step: 2, view: 'TakePhotos', title: 'Take Photos', is_active: false, done: false, is_active_route: false },
          { step: 3, view: 'DrawSketch', title: 'Draw a Sketch', is_active: false, done: false, is_active_route: false }
        ]
      },
      {
        step: 2,
        title: 'Covering, felt and trim',
        is_active: false,
        done: false,
        required: true,
        view: 'CoveringMaterial',
        is_active_route: false,
        sub_steps: [
          { step: 1, view: 'CoveringMaterial', title: 'Covering Material', is_active: true, done: false, is_active_route: false },
          { step: 2, view: 'UnderlaymentTrim', title: 'Felt and Trim', is_active: false, done: false, is_active_route: false },
          { step: 3, view: 'SlopesDamage', title: 'Slopes', is_active: false, done: false, is_active_route: false }
        ]
      },
      {
        step: 3,
        title: 'Ridge & hip',
        is_active: false,
        is_visible: false,
        done: false,
        required: true,
        view: 'RidgeHip',
        is_active_route: false,
        sub_steps: [
          { step: 1, view: 'RidgeHip', title: 'Ridge & Hip', is_active: true, done: false, is_active_route: false }
        ]
      },
      {
        step: 4,
        title: 'Decking',
        is_active: false,
        done: false,
        required: true,
        view: 'DeckingView',
        is_active_route: false,
        sub_steps: [
          { step: 1, view: 'DeckingView', title: 'Decking', is_active: true, done: false, is_active_route: false }
        ]
      },
      {
        step: 5,
        title: 'Additional components',
        is_active: false,
        done: false,
        required: true,
        view: 'AdditionalComponents',
        is_active_route: false,
        sub_steps: [
          { step: 1, view: 'AdditionalComponents', title: 'Additional components', is_active: true, done: false, is_active_route: false }
        ]
      },
      {
        step: 6,
        title: 'Review',
        is_active: false,
        done: false,
        required: true,
        view: 'ReviewView',
        sub_steps: [
          { step: 1, view: 'ReviewView', title: 'Review', is_active: true, done: false, is_active_route: false }
        ]
      }
    ]
  },
  getters: {
    getLeftMenu (state) {
      return state.menu
    },
    getTopMenu (state) {
      let list = []
      let stop = false
      Object.keys(state.menu).forEach(function (index) {
        if (state.menu[index].is_active && !stop) {
          list = state.menu[index].sub_steps
          stop = true
        }
      })
      return list
    },
    getFirstStepComponent (state) {
      return state.menu[0].sub_steps[0].view
    },
    getLastStepComponent (state) {
      const index = state.menu.length - 1
      return state.menu[index].sub_steps[0].view
    }
  },
  mutations: {
    NextStep (state) {
      let stop = false
      const self = this

      Object.keys(state.menu).forEach(function (index) {
        if (state.menu[index].is_active && !stop) {
          // check sub steps
          let nextMainStep = false
          if (state.menu[index].sub_steps.length > 1) {
            let stopSubMenu = false
            let nextIndex = 0

            Object.keys(state.menu[index].sub_steps).forEach(function (i) {
              if (state.menu[index].sub_steps[i].is_active && !stopSubMenu) {
                nextIndex = 1 + 1 * i
                if (nextIndex >= state.menu[index].sub_steps.length) {
                  nextMainStep = true
                  return false
                }

                state.menu[index].sub_steps[i].is_active = false
                state.menu[index].sub_steps[i].done = true
                state.menu[index].sub_steps[nextIndex].is_active = true
                stopSubMenu = true

                if (state.menu[index].sub_steps[nextIndex].view !== undefined) {
                  self.commit('routeToPage', state.menu[index].sub_steps[nextIndex].view)
                }
              }
            })
          } else {
            nextMainStep = true
          }

          // set next main item
          if (nextMainStep) {
            let next = 1 + 1 * index
            if (state.menu[next].is_visible !== undefined && state.menu[next].is_visible === false) {
              next = next + 1
            }

            if (next >= state.menu.length) {
              next = 0
            }

            state.menu[index].is_active = false
            state.menu[index].done = true
            state.menu[next].is_active = true
            stop = true

            if (state.menu[next].sub_steps[0].view !== undefined) {
              self.commit('routeToPage', state.menu[next].sub_steps[0].view)
            }
          }
        }
      })
    },
    BackStep (state) {
      let stop = false
      const self = this
      // if first step - Select roof type - back button redirect to scopes list
      if (state.menu[0].is_active && state.menu[0].sub_steps[0].is_active) {
        self.commit('routeToPage', '')
        return true
      }

      Object.keys(state.menu).forEach(function (index) {
        if (state.menu[index].is_active && !stop) {
          let prevMainStep = false

          if (state.menu[index].sub_steps.length > 1) {
            let stopSubMenu = false
            let prevIndex = 0

            Object.keys(state.menu[index].sub_steps).forEach(function (i) {
              if (state.menu[index].sub_steps[i].is_active && !stopSubMenu) {
                if (1 * i === 0) {
                  prevMainStep = true
                  stopSubMenu = true
                  return false
                }

                prevIndex = (1 * i === 0) ? 0 : 1 * i - 1

                state.menu[index].sub_steps[i].is_active = false
                state.menu[index].sub_steps[i].done = false
                state.menu[index].sub_steps[prevIndex].is_active = true
                state.menu[index].sub_steps[prevIndex].done = false
                stopSubMenu = true

                if (state.menu[index].sub_steps[prevIndex].view !== undefined) {
                  self.commit('routeToPage', state.menu[index].sub_steps[prevIndex].view)
                }
              }
            })
          } else {
            prevMainStep = true
          }

          // set prev main item
          if (prevMainStep) {
            let next = (1 * index === 0) ? 0 : 1 * index - 1
            if (state.menu[next].is_visible !== undefined && state.menu[next].is_visible === false) {
              next = next - 1
            }

            state.menu[index].is_active = false
            state.menu[index].done = false
            state.menu[next].is_active = true
            state.menu[next].done = false
            stop = true

            const count = state.menu[next].sub_steps.length
            if (state.menu[next].sub_steps[count - 1].view !== undefined) {
              self.commit('routeToPage', state.menu[next].sub_steps[count - 1].view)
            }
          }
        }
      })
    },
    routeToPage (state, component) {
      router.push('/' + component)
    },
    SetupStep (state, component) {
      let activeStep = null
      state.menu.forEach((page) => {
        if (activeStep === null) {
          page.done = true
        }

        page.sub_steps.forEach((SubStep) => {
          if (SubStep.view === component) {
            SubStep.is_active = true
            page.is_active = true
            activeStep = page.step
          } else {
            SubStep.is_active = false
            if (activeStep !== page.step) {
              page.is_active = false
            }
          }

          if (activeStep === null) {
            SubStep.done = true
          }
        })
      })
    },
    resetMenu (state) {
      state.menu.forEach((item) => {
        item.is_active = false
        item.done = false
        item.is_active_route = false
        item.is_visible = true
        item.sub_steps.forEach((subStep) => {
          subStep.is_active = false
          subStep.done = false
          subStep.is_active_route = false
          subStep.is_visible = true
        })
      })

      state.menu[0].is_active = true
      state.menu[0].sub_steps[0].is_active = true
    }
  },
  actions: {
    NextStep (context) {
      context.commit('NextStep')
    },
    BackStep (context) {
      context.commit('BackStep')
    },
    SetupStep (context, component) {
      context.commit('SetupStep', component)
    },
    EnableNextStepButton () {
      try {
        document.querySelector('#next-button').classList.add('active')
      } catch (e) {}
    },
    DisableNextStepButton () {
      try {
        document.querySelector('#next-button').classList.remove('active')
      } catch (e) {}
    },
    resetMenu (context) {
      context.commit('resetMenu')
    },
    EnableSubmitButton () {
      try {
        document.querySelector('#submit-button').classList.add('active')
        document.querySelector('#next-button').style.display = 'none'
      } catch (e) {}
    },
    DisableSubmitButton () {
      try {
        document.querySelector('#submit-button').classList.remove('active')
        document.querySelector('#next-button').style.display = 'block'
      } catch (e) {}
    }
  }
}
