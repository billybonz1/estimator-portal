<template>
  <NotificationText v-bind:component_id="'CoveringMaterial'" />

  <div class="central-content">
    <div class="materials">
      <div>
        <div class="section-selector" v-show="SectionsCount > 1">
          <Select2 v-model="currentSectionCode"
                   :options="HouseSections"
                   :settings="{ width: '375px', minimumResultsForSearch: -1 }"
                   @select="setActiveSection"/>
        </div>

        <div class="materials-gallery">
          <div class="materials-gallery-item" v-for="item in CoveringMaterials" :key="item.code"
               v-bind:class="{active: item.code === currentSection.material.code}"
               @click="selectMaterial(item.code)">
            <div class="title">{{ item.title }}</div>
            <img :src="item.img" :alt="item.title" :title="item.title"/>
            <div class="active-ico"></div>
          </div>
        </div>
      </div>

      <div class="covering_table__wrapp" v-show="SectionsCount > 1">
        <table class="table table-small covering-table">
          <thead class="info-table-header">
            <th>Section</th>
            <th>Type</th>
            <th>Material</th>
          </thead>
          <tbody class="info-table-body">
            <tr class="section" v-for="section in this.componentConfig.Sections" :key="section.code">
              <td>{{ section.name }}</td>
              <td>{{ section.code }}</td>
              <td>
                <div v-if="section.material !== undefined && section.material.code !== ''">
                  {{ renderSectionMaterial(section.code, section.material.code) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <ButtonsMenu />

  <DescriptionSlider v-bind:component_id="'Covering'"/>
</template>

<script>
import ButtonsMenu from '@/components/ButtonsMenu'
import Select2 from 'vue3-select2-component'
import NotificationText from '@/components/NotificationText'
import DescriptionSlider from '@/components/DescriptionSlider'
import { BaseComponent } from '@/mixins/BaseComponent'

export default {
  mixins: [BaseComponent],
  components: {
    ButtonsMenu,
    Select2,
    NotificationText,
    DescriptionSlider
  },
  data () {
    return {
      DamageType: '',
      DamageTypes: [
        { id: 'opt1', text: 'opt1' },
        { id: 'opt2', text: 'opt2' }
      ],
      currentSectionCode: '',
      currentSection: {
        material: {
          code: ''
        }
      },
      componentConfig: {
        Sections: []
      },
      notification: 'Select the covering material of the roof. When working with Combination roof, select the covering material for each building section.',
      description: 'Chimneys utilize special type of flashing to seal the contact area with roof surface. When scoping chimneys, measure perimeter of contact to identify correct flashing size.'
    }
  },
  beforeMount () {
    const CurrentScope = this.$store.getters.getCurrentScope
    if (CurrentScope.id === undefined) {
      this.$router.push('/scopes')
    }
    this.componentConfig = this.$store.getters.getComponentConfig('ScopeBuild')
    if (this.componentConfig.Sections === undefined) {
      this.$router.push('/scopes')
    }
    this.initComponentConfig()
  },
  mounted () {
    this.$store.dispatch('setComponentValue', { component: 'ComponentStep', value: 'CoveringMaterial' })
    this.isEnableNextButton()
    this.initComponent()
  },
  computed: {
    CoveringMaterials () {
      const materials = this.$store.getters.getCoveringMaterials

      return this.currentSection.code === 'flat' ? materials.flat : materials.sloped
    },
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
    }
  },
  methods: {
    isEnableNextButton () {
      let canBeEnabled = true
      this.componentConfig.Sections.forEach((item) => {
        if (item.material === undefined || item.material.code === undefined || item.material.code === '') {
          canBeEnabled = false
        }
      })

      if (canBeEnabled) {
        this.$store.dispatch('EnableNextStepButton')
      }
    },
    showInfo () {
      const info = document.querySelector('.covering')
      info.classList.toggle('active')
    },
    initComponentConfig () {
      this.currentSection = this.componentConfig.Sections[0]
      this.currentSectionCode = this.componentConfig.Sections[0].id

      if (this.currentSection.material === undefined) {
        this.currentSection.material = { code: '', title: '' }
      }
      if (this.currentSection.material.title === undefined && this.currentSection.material.code !== '') {
        this.currentSection.material.title = this.renderSectionMaterial(this.currentSection.code, this.currentSection.material.code)
      }

      this.isEnableNextButton()
    },
    setActiveSection () {
      this.componentConfig.Sections.forEach((item) => {
        if (item.id === this.currentSectionCode) {
          this.currentSection = item
          if (this.currentSection.material === undefined) {
            this.currentSection.material = { code: '' }
          }
          return true
        }
      })
    },
    selectMaterial (code) {
      this.currentSection.material.code = code
      this.currentSection.material.title = this.renderSectionMaterial(this.currentSection.code, code)
      this.isEnableNextButton()
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
