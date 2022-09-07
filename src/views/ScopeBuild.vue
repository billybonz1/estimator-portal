<template>

  <NotificationText v-bind:component_id="'ScopeBuild'" />

  <div class="central-content">
    <div class="roof-content">
      <div class="roof-list">
        <div class="roof-list-item" v-for="item in getRoofsDictionary" :key="item.id"
             v-bind:class="({disabled: item.is_disabled, active: item.active})"
             @click="setActiveRoof(item.unique_id)">
          <div class="title"> {{ item.title }} </div>
          <div class="preview">
            <img :src="item.preview" :alt="item.title">
          </div>
        </div>
      </div>

      <div class="roof-details" v-if="(currentRoof.id && currentRoof.scopes_number)">
        <div class="roof-scope-number">
          <div class="roof-scope-title">{{ currentRoof.title }}</div>

          <div class="scope-numbers" v-if="currentRoof.scopes_number_max === undefined">
            {{ currentRoof.scopes_number }} <span class="roof-scope-title"></span>
          </div>
          <div class="number-sections" v-if="currentRoof.scopes_number_max !== undefined">
            <Select2 v-model="currentRoof.scopes_number"
                     :options="getScopesList"
                     :settings="{ width: '120px', minimumResultsForSearch: -1 }"
                     @select="changeNumberScopes()" />
          </div>
          <div class="roof-scope-title">{{ getSlopesLabel() }}</div>
        </div>
        <div class="roof-description">{{ currentRoof.description }}</div>
      </div>

      <div class="roof-combination" v-if="(currentRoof.id && !currentRoof.scopes_number)">
        <div class="number-sections">
          <label>Number of house sections:</label>
          <Select2 v-model="Sections.length"
                   :options="sectionsNums"
                   :settings="{ width: '120px', minimumResultsForSearch: -1 }"
                   @select="changeHouseSection($event)" />
        </div>

        <div class="house-sections">
          <div class="house-sections-body">
            <div class="sections-item" v-for="(section, index) in Sections" :key="index + section.code">
              <div>
                <input type="text" v-model="section.name" @change="updateComponentConfig">
              </div>
              <Select2 v-model="section.code"
                       :options="getRoofTypes"
                       :settings="{ width: '100%', minimumResultsForSearch: -1 }"
                       @select="changeCombinationSectionRoofType($event)"
                       @change="updateComponentConfig"/>

              <Select2 v-model="section.slopes_number"
                       :options="section.SlopesAvailable"
                       :settings="{ width: '100%', minimumResultsForSearch: -1 }"
                       @select="changeCombinationSlopesNumber()"
                       @change="updateComponentConfig"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ButtonsMenu />

  <DescriptionSlider v-bind:component_id="'Overview'"/>

</template>

<script>
import { v4 as uuid } from 'uuid'
import ButtonsMenu from '@/components/ButtonsMenu'
import NotificationText from '@/components/NotificationText'
import DescriptionSlider from '@/components/DescriptionSlider'
import Select2 from 'vue3-select2-component'
import { BaseComponent } from '@/mixins/BaseComponent'

export default {
  mixins: [BaseComponent],
  components: {
    ButtonsMenu, Select2, NotificationText, DescriptionSlider
  },
  data () {
    return {
      sectionsNums: [
        { id: '2', text: '2' },
        { id: '3', text: '3' },
        { id: '4', text: '4' },
        { id: '5', text: '5' },
        { id: '6', text: '6' },
        { id: '7', text: '7' },
        { id: '8', text: '8' },
        { id: '9', text: '9' },
        { id: '10', text: '10' }
      ],
      componentConfig: {},
      currentRoof: {},
      Sections: [],
      notification: 'Select the roof type matching that of the affected property. If property has multiple section or none of the simple roof types match, use “Combination” option',
      description: 'Gable is the most widely used roof type for residential buildings. While usually symmetrical, in some cases the slopes of the gable roof may be different. When scoping gable roofs independently measure pitch and dimensions of each slope.'
    }
  },
  beforeMount () {
    this.componentConfig = this.$store.getters.getComponentConfig('ScopeBuild')

    this.$store.dispatch('resetRoofDictionary')
    this.initComponentConfig()
  },
  mounted () {
    this.isEnableNextButton()
    this.$store.dispatch('setComponentValue', { component: 'ComponentStep', value: 'ScopeBuild' })
    this.initComponent()
  },
  computed: {
    getRoofsDictionary () {
      return this.$store.getters.getRoofsDictionary
    },
    getRoofTypes () {
      const list = []
      this.$store.getters.getRoofTypes.forEach((action) => {
        list.push(
          { id: action.code, text: action.title }
        )
      })
      return list
    },
    // Use for 'Turret' and 'Fan' roof
    getScopesList () {
      const list = []
      if (this.currentRoof.code !== undefined && this.currentRoof.scopes_number_max !== undefined) {
        for (let i = this.currentRoof.scopes_number_min; i <= this.currentRoof.scopes_number_max; i++) {
          list.push(i)
        }
      }
      return list
    }
  },
  methods: {
    getSlopesLabel () {
      return this.currentRoof.scopes_number === 1 ? 'slope' : 'slopes'
    },
    isEnableNextButton () {
      if (this.currentRoof.code !== undefined && this.currentRoof.code !== '') {
        this.$store.dispatch('EnableNextStepButton')
      }
    },
    initComponentConfig () {
      if (this.componentConfig !== undefined && this.componentConfig.UniqueId !== undefined) {
        this.currentRoof = this.$store.getters.getRoofItem(this.componentConfig.UniqueId)
        this.$store.dispatch('setActiveRoofItem', this.componentConfig.UniqueId)
      }

      if (this.componentConfig.Sections !== undefined) {
        this.Sections = this.componentConfig.Sections
      }
    },
    updateComponentConfig () {
      this.$store.dispatch('setupComponent', {
        component: 'ScopeBuild',
        setup: {
          UniqueId: this.currentRoof.unique_id,
          code: this.currentRoof.code,
          Title: this.currentRoof.title,
          ScopesNumber: this.currentRoof.scopes_number,
          Sections: this.Sections
        }
      })
    },
    setActiveRoof (id) {
      // if step completed - roof type can be changes
      if (this.$store.getters.isCompleteComponent('ScopeBuild')) {
        return false
      }

      if (this.currentRoof.unique_id !== id) {
        this.currentRoof = this.$store.getters.getRoofItem(id)
        this.$store.dispatch('setActiveRoofItem', id)
        this.createDefaultSection()
        this.updateComponentConfig()
        this.isEnableNextButton()
        this.$store.dispatch('setComponentValue', { component: 'DrawingTool', value: {} })
      }
    },
    createDefaultSection () {
      this.Sections = []
      this.currentRoof.sections.forEach((section) => {
        if (section !== undefined && section.code !== undefined) {
          section.SlopesAvailable = this.generateSlopesAvailableValues(section.code)
          section.slopes = this.generateSectionSlopes(section.slopes_number)
          this.Sections.push(section)
        }
      })
    },
    changeHouseSection (event) {
      this.Sections = []
      for (let i = 1; i <= event.id; i++) {
        this.Sections.push(
          {
            id: uuid(),
            name: 'Section ' + i,
            code: 'gable',
            slopes_number: 2,
            slopes: this.generateSectionSlopes(2),
            SlopesAvailable: this.generateSlopesAvailableValues('gable'),
            material: { code: '' }
          }
        )
      }
      this.updateComponentConfig()
    },
    changeNumberScopes () {
      this.currentRoof.sections[0].slopes_number = 1 * this.currentRoof.scopes_number
      this.createDefaultSection()
      this.updateComponentConfig()
    },
    changeCombinationSectionRoofType (event) {
      const Roof = this.$store.getters.findRoof(event.id)

      this.Sections.forEach((section) => {
        if (section.code === event.id) {
          section.slopes_number = Roof.scopes_number
          section.slopes = this.generateSectionSlopes(section.slopes_number)
          section.SlopesAvailable = this.generateSlopesAvailableValues(section.code)
        }
      })

      this.updateComponentConfig()
    },
    changeCombinationSlopesNumber () {
      this.Sections.forEach((section) => {
        section.slopes = this.generateSectionSlopes(section.slopes_number)
      })
      this.updateComponentConfig()
    },
    generateSectionSlopes (count) {
      const list = []
      for (let i = 1; i <= count; i++) {
        list.push(
          {
            id: uuid(),
            name: 'Slope ' + i
          }
        )
      }
      return list
    },
    generateSlopesAvailableValues (SectionCode) {
      const Roof = this.$store.getters.findRoof(SectionCode)
      const min = Roof.scopes_number_min !== undefined ? Roof.scopes_number_min : Roof.scopes_number
      const max = Roof.scopes_number_max !== undefined ? Roof.scopes_number_max : Roof.scopes_number

      const list = []
      for (let i = min; i <= max; i++) {
        list.push(i)
      }
      return list
    }
  }
}
</script>
