<template>
  <div class="overview_info">
    <h1>Decking</h1>
    <div class="" v-show="SectionsCount > 1">
      <Select2 v-model="currentSectionCode"
               :options="HouseSections"
               :settings="{ width: '375px', minimumResultsForSearch: -1 }"
               @select="setActiveSection"/>
    </div>
  </div>

  <ul class="overview_line__list">
    <li v-for="item in DeckingConfig" :key="'m-' + item.key"
        v-bind:class="[item.isBool ? (item.value ? 'yes' : 'no') : '']">
      <div>{{ item.label }}:</div>
      <div>{{ item.formatValue }}</div>
    </li>
  </ul>

  <table class="table table-small overview_table">
    <thead>
    <tr>
      <th></th>
      <th v-for="slope in SlopesConfig" :key="'s-' + slope.id">
        {{ slope.name }}
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="row in sectionTableRows" :key="'row-' + row.code">
      <td>{{ row.title }}</td>
      <td v-for="(td, i) in row.slopes" :key="'td-' + i">
          <span v-if="typeof td.value === 'boolean'" v-bind:class="[td.value ? 'yes' : 'no']">
            {{ td.formatValue }}
          </span>
        <span v-else>{{ td.formatValue }}</span>
      </td>
    </tr>
    </tbody>
  </table>
  <div class="photo-additional-content">
    <ReviewPhotoGallery :params="{ components: ['DeckingView'] }"/>
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
    DeckingConfig () {
      const list = []
      let formatValue = ''
      let isBool = false

      for (const [key, value] of Object.entries(this.componentConfig.Decking)) {
        isBool = (typeof value === 'boolean')
        formatValue = isBool ? (value ? 'Yes' : 'No') : value

        if (formatValue !== '' && key !== 'Damaged') {
          list.push(
            { key: key, label: this.getLabelTranslate(key), value: value, formatValue: formatValue, isBool: isBool }
          )
        }
      }
      return list
    },
    SlopesConfig () {
      const slopes = []
      if (Array.isArray(this.currentSection.slopes)) {
        this.currentSection.slopes.forEach((slope) => {
          slopes.push({
            id: slope.id,
            name: slope.name
          })
        })
      }
      return slopes
    },
    sectionTableRows () {
      return [
        { title: 'Decking damage', slopes: this.getSlopesDeckingDamaged() },
        { title: 'Damage area, sq ft/%', slopes: this.getSlopesDeckingArea() },
        // { title: 'Corrective action', slopes: this.getSlopesCorrectiveAction() },
        { title: 'Photos', slopes: this.getSlopesPhotos() }
      ]
    }
  },
  methods: {
    getSlopesDeckingDamaged () {
      const slopes = []
      if (Array.isArray(this.currentSection.slopes)) {
        this.currentSection.slopes.forEach((slope) => {
          if (slope.DeckingDamaged === undefined) {
            slopes.push({ value: '-', formatValue: '-' })
          } else {
            slopes.push({
              value: slope.DeckingDamaged,
              formatValue: slope.DeckingDamaged ? 'Yes' : 'No'
            })
          }
        })
      }
      return slopes
    },
    getSlopesDeckingArea () {
      const slopes = []
      if (Array.isArray(this.currentSection.slopes)) {
        this.currentSection.slopes.forEach((slope) => {
          if (slope.DeckingDamaged === undefined || slope.DeckingDamagedArea === undefined) {
            slopes.push({ value: '-', formatValue: '-' })
          } else {
            slopes.push({
              value: slope.DeckingDamagedArea,
              formatValue: slope.DeckingDamagedArea
            })
          }
        })
      }
      return slopes
    },
    getSlopesCorrectiveAction () {
      const slopes = []
      if (Array.isArray(this.currentSection.slopes)) {
        this.currentSection.slopes.forEach((slope) => {
          if (slope.DeckingDamaged === false || slope.DeckingCorrectiveAction === undefined) {
            slopes.push({ value: '', formatValue: '-' })
          } else {
            slopes.push({
              value: slope.DeckingCorrectiveAction,
              formatValue: slope.DeckingCorrectiveAction
            })
          }
        })
      }
      return slopes
    },
    getSlopesPhotos () {
      const slopes = []
      if (Array.isArray(this.currentSection.slopes)) {
        this.currentSection.slopes.forEach((slope) => {
          let count = 0
          if (Array.isArray(this.$store.getters.getCurrentScope.photos)) {
            const Photos = this.$store.getters.getCurrentScope.photos.filter(photo => {
              return ['DeckingView'].includes(photo.component) && photo.section === slope.id
            })
            count = Photos.length
          }

          slopes.push({
            value: count,
            formatValue: count
          })
        })
      }
      return slopes
    },
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
