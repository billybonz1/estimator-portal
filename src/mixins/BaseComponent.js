export const BaseComponent = {
  methods: {
    initComponent () {
      try {
        this.detectVisibleTopMenu()
        this.detectVisibleBottomMenu()
      } catch (e) {}
    },
    detectVisibleTopMenu () {
      const isVisible = this.$route.name === 'ReviewView' ? 'none' : 'flex'
      document.querySelector('.top-menu').style.display = isVisible
    },
    detectVisibleBottomMenu () {
      document.querySelector('.bottom-buttons').style.display = 'flex'
    },
    isMetalRoofSection (Section) {
      if (Section === undefined || Section.material === undefined || Section.material.code === undefined) {
        return false
      }

      const Scenario3 = this.$store.getters.getRoofScopingScenarios.find(m => {
        return m.code === 'scenario-3'
      })
      return Scenario3.materials.includes(Section.material.code)
    },
    getFootSeparator () {
      return '\''
    },
    getInchesSeparator () {
      return '"'
    },
    getFootAndInchesPlaceHolder () {
      return '0\'00"'
    },
    numberMask () {
      return { mask: '#*' }
    },
    FootAndInchesMask () {
      return {
        mask: '#*\'##"',
        preprocessor: function (string) {
          const Foot = '\''
          const Inches = '"'
          const m = string.split(Foot)
          let foot = 1 * m[0]
          let inches = 0
          if (m[1] !== undefined && m[1].length > 1) {
            if (m[1].includes('"')) {
              if (m[1].length === 2) {
                m[1] = '0' + m[1]
              }
            }
            inches = parseInt(1 * m[1].replace('"', ''))

            const feet = parseInt((inches / 12))
            foot = foot + feet
            inches = inches - (feet * 12)
            if (inches === 0) {
              inches = ''
            }
            if (inches > 0 && inches < 10) {
              inches = '0' + inches
            }
            string = foot + Foot + inches + Inches
          }
          return string
        }
      }
    },
    getAngleChar () {
      return String.fromCharCode('8736')
    }
  }
}
