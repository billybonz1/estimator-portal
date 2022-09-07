<template>
  <h1>Additional components</h1>
  <ul class="content-tabs additional_tabs">
    <li v-for="(tab, index) in additionalTabs" :key="'tab-' + index" @click="setCurrentTab(tab)"
        v-bind:class="[currentAdditionalTab === tab ? 'selected' : '']">
      {{ tab }} <span>{{ getComponentCount(tab) }}</span>
    </li>
  </ul>

  <div class="additional_content">
    <div class="additional_content__tab">
      <div v-for="(AdditionalComponent, index) in SelectedTabComponents" :key="index" style="margin: 20px 0;">
        <div class="additional_list" v-show="AdditionalComponent.simpleView">
          <div class="name">{{ AdditionalComponent.title }}</div>
          <ul class="overview_line__list">
            <li>
              <div>Quantity total/damaged:</div>
              <div>{{ AdditionalComponent.ElementsCount }}/{{ AdditionalComponent.ElementsDamaged }}</div>
            </li>
          </ul>
        </div>

        <div v-show="AdditionalComponent.simpleView === false">
          <div class="additional_list">
            <div class="name">{{ AdditionalComponent.title }}</div>
            <ul class="overview_line__list">
              <li>
                <div>Quantity total/damage:</div>
                <div>{{ AdditionalComponent.ElementsCount }}/{{ getComponentDamagedCount(AdditionalComponent) }}</div>
              </li>
            </ul>
          </div>

          <table class="table table-small overview_table">
            <thead>
              <tr>
                <th>Data</th>
                <th v-for="el in ElementsConfig(AdditionalComponent)" :key="'s-' + el.id">
                  {{ el.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in sectionTableRows(AdditionalComponent)" :key="'row-' + row.code">
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
        </div>
      </div>
    </div>
  </div>

  <div class="photo-additional-content">
    <ReviewPhotoGallery :params="{ components: ['AdditionalComponents'], sections: [currentAdditionalTab] }"/>
  </div>
</template>

<script>
import ReviewPhotoGallery from '@/components/ReviewPhotoGallery'

export default {
  components: {
    ReviewPhotoGallery
  },
  data () {
    return {
      currentAdditionalTab: 'flashing',
      additionalTabs: [
        'flashing', 'ventilation', 'drainage', 'other'
      ]
    }
  },
  beforeMount () {
    this.componentConfig = this.$store.getters.getComponentConfig('ScopeBuild')
  },
  mounted () {
    this.$store.dispatch('setCurrentReviewTab2', 'flashing')
  },
  computed: {
    SelectedTabComponents () {
      const list = this.componentConfig.AdditionalComponents.filter(
        item => item.type === this.currentAdditionalTab
      )
      return list.reverse()
    }
  },
  methods: {
    setCurrentTab (tab) {
      this.currentAdditionalTab = tab
      this.$store.dispatch('setCurrentReviewTab2', tab)
    },
    getComponentCount (component) {
      const list = this.componentConfig.AdditionalComponents.filter(
        item => item.type === component
      )
      return list.length
    },
    ElementsConfig (AdditionalComponent) {
      const list = []
      if (Array.isArray(AdditionalComponent.Elements)) {
        AdditionalComponent.Elements.forEach((element, index) => {
          const id = index + 1
          list.push({
            id: id,
            name: AdditionalComponent.title + ' ' + id
          })
        })
      }
      return list
    },
    sectionTableRows (AdditionalComponent) {
      const rows = []
      if (AdditionalComponent.materials !== undefined) {
        rows.push({ title: 'Material', slopes: this.getComponentMaterial(AdditionalComponent) })
      }

      if (AdditionalComponent.units !== undefined) {
        AdditionalComponent.units.forEach((unit, index) => {
          rows.push({ title: unit.label, slopes: this.getComponentSize(AdditionalComponent, unit.label) })
        })
      }

      if (AdditionalComponent.AddSize !== undefined && AdditionalComponent.AddSize.code !== '') {
        rows.push({
          title: AdditionalComponent.AddSize.code,
          slopes: [
            { formatValue: AdditionalComponent.AddSize.values[0] }
          ]
        })
      }

      rows.push({
        title: 'Damage',
        slopes: this.getComponentDamage(AdditionalComponent)
      })
      return rows
    },
    getComponentDamage (AdditionalComponent) {
      const list = []
      AdditionalComponent.Elements.forEach((element, index) => {
        list.push({ value: element.Damaged, formatValue: element.Damaged ? 'Yes' : 'No' })
      })
      return list
    },
    getComponentMaterial (AdditionalComponent) {
      const list = []
      AdditionalComponent.Elements.forEach((element, index) => {
        list.push({ value: element.Material, formatValue: element.Material })
      })
      return list
    },
    getComponentSize (AdditionalComponent, UnitLabel) {
      const list = []
      AdditionalComponent.Elements.forEach((element, index) => {
        const unit = element.Units.find(item => item.label === UnitLabel)
        if (unit !== undefined) {
          list.push({ value: unit.value, formatValue: unit.value })
        }
      })
      return list
    },
    getComponentDamagedCount (AdditionalComponent) {
      let count = 0
      AdditionalComponent.Elements.forEach((element, index) => {
        if (element.Damaged) {
          count++
        }
      })
      return count
    }
  }
}
</script>
