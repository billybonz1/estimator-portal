<template>
  <div class="overview_info">
    <h1>Ridge & hip</h1>
    <div class="" v-show="SectionsCount > 1">
      <Select2 v-model="currentSectionCode"
               :options="HouseSections"
               :settings="{ width: '375px', minimumResultsForSearch: -1 }"
               @select="setActiveSection"/>
    </div>
  </div>

  <ul class="overview_line__list">
    <li v-for="item in RidgeConfig" :key="'m-' + item.key"
      v-bind:class="[item.isBool ? (item.value ? 'yes' : 'no') : '']">
      <div>{{ item.label }}:</div>
      <div>{{ item.formatValue }}</div>
    </li>
  </ul>

  <div class="photo-additional-content">
    <ReviewPhotoGallery :params="{ components: ['RidgesAndHips'] }"/>
  </div>
</template>

<script>
import ReviewPhotoGallery from '@/components/ReviewPhotoGallery'
import Select2 from 'vue3-select2-component'
import { Units } from '@/mixins/Units'

export default {
  mixins: [Units],
  components: {
    ReviewPhotoGallery, Select2
  },
  data () {
    return {
      componentConfig: {},
      currentSection: {},
      currentSectionCode: ''
    }
  },
  beforeMount () {
    this.componentConfig = this.$store.getters.getComponentConfig('ScopeBuild')
    this.initComponentConfig()
  },
  computed: {
    SectionsCount () {
      return this.componentConfig.Sections.length
    },
    HouseSections () {
      const list = []
      this.componentConfig.Sections.forEach((section) => {
        list.push(
          { id: section.id, text: section.name }
        )
      })
      return list
    },
    RidgeConfig () {
      const list = []
      let formatValue = ''
      let isBool = false
      const RidgeFields = [
        'RidgeLength', 'HipLength',
        'RidgeCapMaterial', 'RidgeCapDamaged', 'ClosureStripsDamaged', 'ClosureStripsVented',
        'RidgeCapTotalLengthDamaged', 'ClosureStripsLengthDamaged'
      ]

      for (const [key, value] of Object.entries(this.currentSection)) {
        if (!RidgeFields.includes(key)) {
          continue
        }

        isBool = (typeof value === 'boolean')
        formatValue = isBool ? (value ? 'Yes' : 'No') : value

        if (formatValue !== '') {
          list.push(
            { key: key, label: this.getLabelTranslate(key), value: value, formatValue: formatValue, isBool: isBool }
          )
        }
      }
      return list
    }
  },
  methods: {
    initComponentConfig () {
      this.currentSection = this.componentConfig.Sections[0]
      this.currentSectionCode = this.componentConfig.Sections[0].id
    },
    setActiveSection () {
      this.componentConfig.Sections.forEach((item) => {
        if (item.id === this.currentSectionCode) {
          this.currentSection = item
          return true
        }
      })
    }
  }
}
</script>
