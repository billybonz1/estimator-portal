<template>
  <div class="overview_info">
    <h1>Covering, felt and trim</h1>
    <div class="" v-show="SectionsCount > 1">
      <Select2 v-model="currentSectionCode"
               :options="HouseSections"
               :settings="{ width: '375px', minimumResultsForSearch: -1 }"
               @select="setActiveSection"/>
    </div>
  </div>

  <ul class="overview_line__list">
    <li>
      <div>Type:</div>
      <div>{{ renderSectionMaterial(currentSection.code, currentSection.material.code) }}</div>
    </li>
    <li v-for="item in MaterialConfig" :key="'m-' + item.key"
        v-bind:class="[item.isBool ? (item.value ? 'yes' : 'no') : '']">
      <div>{{ item.label }}:</div>
      <div>{{ item.formatValue }}</div>
    </li>
    <li v-show="currentSection.Parapet !== undefined">
      <div>Parapet: <span>{{ (currentSection.Parapet ? 'yes' : 'no')}}</span></div>
      <div>Height of parapet: {{ currentSection.ParapetHeight }}</div>
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
    <ReviewPhotoGallery :params="{ components: PhotoComponents }"/>
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
      currentSectionCode: '',
      PhotoComponents: ['Underlayment', 'SlopesDamageSurface', 'SlopesDamagePitch']
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
    MaterialConfig () {
      const list = []
      let formatValue = ''
      let isBool = false

      for (const [key, value] of Object.entries(this.currentSection.material.config)) {
        isBool = (typeof value === 'boolean')
        formatValue = isBool ? (value ? 'Yes' : 'No') : value

        if (formatValue !== '') {
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
      const TableRows = [
        { code: 'Area', title: 'Area, sq ft', slopes: this.getSlopesArea() }
      ]

      // Pitch row
      let PitchRow = false
      this.currentSection.slopes.forEach((slope) => {
        if (slope.pitch !== undefined && slope.pitch !== '') {
          PitchRow = true
        }
      })
      if (PitchRow) {
        TableRows.push(
          { code: 'Pitch', title: 'Pitch', slopes: this.getSlopesPitch() }
        )
      }
      const DamagedAreaTitle = this.getSlopesEvaluatedDamageTitle()

      TableRows.push({ code: 'CoveringDamaged', title: 'Covering damage', slopes: this.getSlopesCoveringDamaged() })
      TableRows.push({ code: 'DamagedArea', title: DamagedAreaTitle, slopes: this.getSlopesDamagedArea() })
      TableRows.push({ code: 'CoveringDamaged', title: 'Covering damage', slopes: this.getSlopesCoveringDamaged() })
      TableRows.push({ code: 'UnderlaymentDamaged', title: 'Felt damage', slopes: this.getSlopesUnderlaymentDamaged() })
      TableRows.push({ code: 'Photos', title: 'Photos', slopes: this.getSlopesPhotos() })
      return TableRows
    }
  },
  methods: {
    getSlopesArea () {
      const slopes = []
      if (Array.isArray(this.currentSection.slopes)) {
        this.currentSection.slopes.forEach((slope) => {
          slopes.push({ value: slope.area, formatValue: slope.area })
        })
      }
      return slopes
    },
    getSlopesPitch () {
      const slopes = []
      if (Array.isArray(this.currentSection.slopes)) {
        this.currentSection.slopes.forEach((slope) => {
          slopes.push({ value: slope.pitch, formatValue: slope.pitch })
        })
      }
      return slopes
    },
    getSlopesEvaluatedDamageTitle () {
      let EvaluateDamageBy = 'Area'
      this.currentSection.slopes.forEach((slope) => {
        EvaluateDamageBy = slope.EvaluateDamageBy === 'square' ? 'Test square' : 'Area'
        return true
      })
      return EvaluateDamageBy === 'Area' ? 'Damage area, sq ft/%' : 'Number of hits per square'
    },
    getSlopesDamagedArea () {
      const slopes = []
      if (Array.isArray(this.currentSection.slopes)) {
        this.currentSection.slopes.forEach((slope) => {
          if (slope.CoveringDamaged === false || slope.EvaluateDamageBy === undefined) {
            slopes.push({ value: '', formatValue: '-' })
          } else {
            const formatValue = slope.EvaluateDamageBy === 'area' ? this.getEvaluateAreaValue(slope) : slope.NumberOfHits
            slopes.push({
              value: '',
              formatValue: formatValue
            })
          }
        })
      }
      return slopes
    },
    getEvaluateAreaValue (slope) {
      const DamagedArea = slope.EvaluateArea === undefined ? 0 : 1 * slope.EvaluateArea
      const percent = (100 * DamagedArea / parseInt(slope.area)).toFixed(2)

      return slope.EvaluateArea + ' sq ft / ' + percent + '%'
    },
    getSlopesCorrectiveAction () {
      const slopes = []
      if (Array.isArray(this.currentSection.slopes)) {
        this.currentSection.slopes.forEach((slope) => {
          if (slope.CoveringDamaged === false || slope.CorrectiveAction === undefined) {
            slopes.push({ value: '', formatValue: '-' })
          } else {
            const action = this.$store.getters.getCorrectiveActions.find((action) => {
              return action.code === slope.CorrectiveAction
            })

            slopes.push({
              value: slope.CorrectiveAction,
              formatValue: action.title
            })
          }
        })
      }
      return slopes
    },
    getSlopesUnderlaymentDamaged () {
      const slopes = []
      if (Array.isArray(this.currentSection.slopes)) {
        this.currentSection.slopes.forEach((slope) => {
          if (slope.UnderlaymentDamaged === undefined) {
            slopes.push({ value: '', formatValue: '-' })
          } else {
            slopes.push({
              value: slope.UnderlaymentDamaged,
              formatValue: slope.UnderlaymentDamaged ? 'Yes' : 'No'
            })
          }
        })
      }
      return slopes
    },
    getSlopesCoveringDamaged () {
      const slopes = []
      if (Array.isArray(this.currentSection.slopes)) {
        this.currentSection.slopes.forEach((slope) => {
          slopes.push({
            value: slope.CoveringDamaged,
            formatValue: slope.CoveringDamaged ? 'Yes' : 'No'
          })
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
              return this.PhotoComponents.includes(photo.component) && photo.section === slope.id
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
    },
    renderSectionMaterial (sectionCode, materialCode) {
      let materials = this.$store.getters.getCoveringMaterials
      materials = sectionCode === 'flat' ? materials.flat : materials.sloped

      const selected = materials.find(item => item.code === materialCode)
      return selected === undefined ? '' : selected.title
    }
  }
}
</script>
