export const Units = {
  methods: {
    getFootArea (length, width) {
      length = this.stringToInches(length)
      width = this.stringToInches(width)
      return ((length * width) / (12 * 12)).toFixed(0)
    },
    parseFoot (string) {
      string = string.replace('’’', this.getInchesSeparator()).replace('’', this.getFootSeparator())
      const m = string.split(this.getFootSeparator())
      let foot = 1 * m[0]
      let inches = 0
      if (m[1] !== undefined) {
        inches = parseInt(1 * m[1].replace('"', ''))
        foot = foot + (inches / 12)
      }
      return foot
    },
    toFeetInches (string) {
      string = string.replace('’’', this.getInchesSeparator()).replace('’', this.getFootSeparator())
      const m = string.split(this.getFootSeparator())
      let foot = 1 * m[0]
      let inches = 0
      if (m[1] !== undefined) {
        inches = parseInt(1 * m[1].replace('"', ''))
        const feet = parseInt((inches / 12))
        foot = foot + feet
        inches = inches - (feet * 12)
      }
      return foot + this.getFootSeparator() + inches + this.getInchesSeparator()
    },
    stringToInches (string) {
      string = string.replace('’’', this.getInchesSeparator()).replace('’', this.getFootSeparator())
      const m = string.split(this.getFootSeparator())
      let inches = 12 * m[0]
      if (m[1] !== undefined) {
        inches = inches + parseInt(1 * m[1].replace('"', ''))
      }
      return inches
    },
    InchesToString (inches) {
      const feet = parseInt((1 * inches / 12))
      inches = 1 * inches - (feet * 12)

      return feet + this.getFootSeparator() + inches + this.getInchesSeparator()
    },
    getLabelTranslate (code) {
      const translate = this.translateLabel(code)
      if (translate !== '') {
        return translate
      }

      const titles = code.replace('_', ' ').split(/(?=[A-Z])/)
      const title = titles.join(' ').toLowerCase()
      return title.charAt(0).toUpperCase() + title.slice(1)
    },
    translateLabel (code) {
      const translate = this.translateDictionaries().find(m => {
        return m.code === code
      })
      return (translate !== undefined && translate.title !== undefined) ? translate.title : ''
    },
    translateDictionaries () {
      return [
        { code: 'layers', title: 'Number of layers' },
        { code: 'UnderlaymentDamaged', title: 'Felt damage' },
        { code: 'CoveringDamaged', title: 'Covering damage' },
        { code: 'underlayment_code', title: 'Felt' },
        { code: 'thickness', title: 'Thickness/Gauge' },
        { code: 'EvaluateDamageBy', title: 'Evaluate damage by' },
        { code: 'RidgeCapMaterial', title: 'Material' },
        { code: 'RidgeCapDamaged', title: 'Ridge cap damage' },
        { code: 'ClosureStripsDamaged', title: 'Closure strips damage' }
      ]
    }
  }
}
