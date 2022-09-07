
<template>
  <NotificationText v-bind:component_id="'AdditionalComponents'" />

  <div class="central-content additional_page">
    <div class="additional_top__menu">
      <ul class="content-tabs">
        <li @click="setCurrentTab('flashing')" v-bind:class="[currentTab === 'flashing' ? 'selected' : '']">Flashing
          <span>{{ getComponentCount('flashing') }}</span>
        </li>
        <li @click="setCurrentTab('ventilation')" v-bind:class="[currentTab === 'ventilation' ? 'selected' : '']">Ventilation
          <span>{{ getComponentCount('ventilation') }}</span>
        </li>
        <li @click="setCurrentTab('drainage')" v-bind:class="[currentTab === 'drainage' ? 'selected' : '']">Drainage
          <span>{{ getComponentCount('drainage') }}</span>
        </li>
        <li @click="setCurrentTab('other')" v-bind:class="[currentTab === 'other' ? 'selected' : '']">Other
          <span>{{ getComponentCount('other') }}</span>
        </li>
      </ul>
    </div>

    <div class="content-tab-content additional_tab__flashing" v-show="currentTab === 'flashing'">
      <div class="materials-gallery">
        <div class="materials-gallery-item" v-for="item in FlashingComponents" :key="item.code"
             v-bind:class="{active: isActiveComponent(item)}"
             @click="selectComponent(item)">
          <div class="title">{{ item.title }}</div>
          <img :src="item.img" :alt="item.title" :title="item.title"/>
          <div class="active-ico"></div>
        </div>
      </div>
    </div>

    <div class="content-tab-content additional_tab__ventilation" v-show="currentTab === 'ventilation'">
      <div class="materials-gallery">
        <div class="materials-gallery-item" v-for="item in VentilationComponents" :key="item.code"
             v-bind:class="{active: isActiveComponent(item)}"
             @click="selectComponent(item)">
          <div class="title">{{ item.title }}</div>
          <img :src="item.img" :alt="item.title" :title="item.title"/>
          <div class="active-ico"></div>
        </div>
      </div>
    </div>

    <div class="content-tab-content additional_tab__drainage" v-show="currentTab === 'drainage'">
      <div class="materials-gallery">
        <div class="materials-gallery-item" v-for="item in DrainageComponents" :key="item.code"
             v-bind:class="{active: isActiveComponent(item)}"
             @click="selectComponent(item)">
          <div class="title">{{ item.title }}</div>
          <img :src="item.img" :alt="item.title" :title="item.title"/>
          <div class="active-ico"></div>
        </div>
      </div>
    </div>

    <div class="content-tab-content additional_tab__other" v-show="currentTab === 'other'">
      <div class="materials-gallery">
        <div class="materials-gallery-item" v-for="item in OtherComponents" :key="item.code"
             v-bind:class="{active: isActiveComponent(item)}"
             @click="selectComponent(item)">
          <div class="title">{{ item.title }}</div>
          <img :src="item.img" :alt="item.title" :title="item.title"/>
          <div class="active-ico"></div>
        </div>
      </div>
    </div>

    <div class="additional-content">
      <div class="additional_settings" v-for="(AdditionalComponent, index) in SelectedTabComponents" :key="index">
        <div v-show="AdditionalComponent.simpleView">
          <div class="field_row jsElement">
            <div class="inline_field element_name">
              <div class="lebel">{{ AdditionalComponent.title }}</div>
              <div>
                <input class="jsElementsCount" type="text" name="" inputmode="numeric" style="width:80px;"
                       v-model="AdditionalComponent.ElementsCount"
                       v-maska="numberMask()" @change="checkElementsCount()">
              </div>
            </div>
            <div class="inline_field">
              <div class="lebel">damaged:</div>
              <div>
                <input class="jsElementsDamagedCount" type="text" name="" inputmode="numeric" style="width:80px;"
                       v-model="AdditionalComponent.ElementsDamaged"
                       v-maska="numberMask()" @change="checkElementsCount()">
              </div>
            </div>
          </div>
        </div>
        <div v-show="AdditionalComponent.simpleView === false">
          <div class="field_row">
            <div class="inline_field element_name">
              <div class="lebel">{{ AdditionalComponent.title }}</div>
              <div>
                <input type="text" style="width:80px;" min="1" max="100"
                       @change="changeComponentCount(AdditionalComponent.code)"
                       v-model="AdditionalComponent.ElementsCount"
                       inputmode="numeric"
                       v-maska="numberMask()">
              </div>
            </div>
          </div>
          <div class="additional_damage__grid">
            <div class="additional_damage__item" v-for="(Element, i) in AdditionalComponent.Elements" :key="i">
              <div class="item_number">{{ 1 + i }}</div>
              <div class="field">
                <div class="lebel">damage</div>
                <div>
                  <label class="switch" :for="'id_index' + index + i">
                    <input :id="'id_index' + index + i" type="checkbox" v-model="Element.Damaged">
                    <div class="slider red round"></div>
                  </label>
                </div>
              </div>
              <div class="field" v-show="AdditionalComponent.materials !== undefined">
                <div class="lebel">Material</div>
                <div>
                  <Select2 v-model="Element.Material"
                           :options="AdditionalComponent.materials"
                           :settings="{ width: '125px', minimumResultsForSearch: -1 }" />
                </div>
              </div>

              <div class="field" v-show="AdditionalComponent.AddSize.code !== ''">
                <div class="lebel">{{ AdditionalComponent.AddSize.code }}</div>
                <div>
                  <Select2 v-model="Element.Size"
                           :options="AdditionalComponent.AddSize.values"
                           :settings="{ width: '150px', minimumResultsForSearch: -1 }" />
                </div>
              </div>

              <div class="field" v-for="(item, k) in Element.Units" :key="'units-' + k">
                <div class="lebel">{{ item.label }}</div>
                <div>
                  <input type="text" name="" style="width:60px;" :title="item.unit"
                         v-maska="FootAndInchesMask()" :placeholder="getFootAndInchesPlaceHolder()"
                         v-model="item.value">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="photo-additional-content">
      <PhotoGallery InfoText="Components" :params="{ component: 'AdditionalComponents', section: currentTab }" />
    </div>
  </div>

  <ButtonsMenu />

  <DescriptionSlider v-bind:component_id="'Additional'"/>
</template>

<script>
import ButtonsMenu from '@/components/ButtonsMenu'
import PhotoGallery from '@/components/PhotoGallery'
import Select2 from 'vue3-select2-component'
import { maska } from 'maska'
import NotificationText from '@/components/NotificationText'
import DescriptionSlider from '@/components/DescriptionSlider'
import { BaseComponent } from '@/mixins/BaseComponent'

export default {
  mixins: [BaseComponent],
  components: {
    ButtonsMenu, Select2, PhotoGallery, NotificationText, DescriptionSlider
  },
  directives: {
    maska
  },
  data () {
    return {
      currentTab: 'flashing',
      componentConfig: {
        AdditionalComponents: []
      },
      CorrectiveActions: ['Repair', 'Replace', 'Detach and reset'],
      notification: 'Identify all additional components present on the roof. For each additional component identify total quantity/amount, quantity/amount damaged and take detailed pictures',
      description: 'The most widely used decking materials for a sloped roof are plywood and OSB (oriented strand board). Spaced decking is typically used for cedar shakes roofs to allow for extra ventilation, while purlins are utilized for metal roof coverings with or without felt.'
    }
  },
  beforeMount () {
    const CurrentScope = this.$store.getters.getCurrentScope
    if (CurrentScope.id === undefined) {
      this.$router.push('/scopes')
    }
    this.componentConfig = this.$store.getters.getComponentConfig('ScopeBuild')
    this.initComponentConfig()
  },
  mounted () {
    this.$store.dispatch('DisableSubmitButton')
    this.isEnableNextButton()
    this.$store.dispatch('setComponentValue', { component: 'ComponentStep', value: 'AdditionalComponents' })
    this.initComponent()
    this.setCurrentTab('flashing')
  },
  computed: {
    SelectedTabComponents () {
      const list = this.componentConfig.AdditionalComponents.filter(
        item => item.type === this.currentTab
      )
      return list.reverse()
    },
    FlashingComponents () {
      return this.filterComponent('flashing')
    },
    VentilationComponents () {
      return this.filterComponent('ventilation')
    },
    DrainageComponents () {
      return this.filterComponent('drainage')
    },
    OtherComponents () {
      return this.filterComponent('other')
    }
  },
  methods: {
    // filter by roof type - RoofTypes: ['Flat'], ['Flat with parapet'], ['Sloped']
    filterComponentByRoofType (list) {
      const isFlat = this.componentConfig.UniqueId === '2'
      const isFlatWithParapet = isFlat && (this.componentConfig.Sections[0].Parapet !== undefined && this.componentConfig.Sections[0].Parapet)
      const isMetalRoof = this.isMetalRoofSection(this.componentConfig.Sections[0])

      list = list.filter(component => {
        // Any roof
        if (component.RoofTypes === undefined) {
          return true
        }

        if (isFlat) {
          return isFlatWithParapet ? component.RoofTypes.includes('Flat with parapet') : component.RoofTypes.includes('Flat')
        } else {
          if (component.RoofTypes.includes('Sloped') && component.RoofTypes.includes('metal')) {
            return isMetalRoof
          }
          return component.RoofTypes.includes('Sloped')
        }
      })
      return list
    },
    filterComponent (type) {
      return this.filterComponentByRoofType(
        this.$store.getters.getAdditionalComponents.filter(component => {
          return component.type === type
        })
      )
    },
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
      const info = document.querySelector('.additional')

      info.classList.toggle('active')
    },
    initComponentConfig () {
      if (this.componentConfig.AdditionalComponents === undefined) {
        this.componentConfig.AdditionalComponents = []
      }
    },
    selectComponent (component) {
      const exist = this.componentConfig.AdditionalComponents.find(item => item.code === component.code)
      if (exist === undefined) {
        this.addComponent(component)
      } else {
        // remove
        this.componentConfig.AdditionalComponents = this.componentConfig.AdditionalComponents.filter(
          item => item.code !== component.code
        )
      }
    },
    changeComponentCount (code) {
      this.updateComponentElements(
        this.componentConfig.AdditionalComponents.find(item => item.code === code)
      )
    },
    addComponent (component) {
      component.simpleView = (
        component.materials === undefined && component.size === undefined && component.units.length === 0 && component.AddSize === undefined
      )
      component.CorrectiveAction = 'Repair'
      if (component.AddSize === undefined) {
        component.AddSize = { code: '', values: [] }
      }
      component.ElementsCount = 1
      component.Elements = []
      this.updateComponentElements(component)

      this.componentConfig.AdditionalComponents.push(component)
    },
    updateComponentElements (component) {
      // add new element
      if (component.Elements.length < component.ElementsCount) {
        this.addComponentElements(component, component.ElementsCount - component.Elements.length)
      } else {
        // remove elements
        const count = component.Elements.length - component.ElementsCount
        if (count > 0) {
          component.Elements = component.Elements.filter((element, index) => {
            return index < component.ElementsCount
          })
        }
      }
    },
    addComponentElements (component, count) {
      for (let i = 1; i <= count; i++) {
        const Units = []
        component.units.forEach((u) => {
          Units.push({ label: u.label, unit: u.unit, value: '' })
        })

        component.Elements.push({
          Damaged: true,
          Units: Units
        })
      }
    },
    isActiveComponent (component) {
      const exist = this.componentConfig.AdditionalComponents.find(item => item.code === component.code)

      return exist !== undefined
    },
    getComponentCount (component) {
      const list = this.componentConfig.AdditionalComponents.filter(
        item => item.type === component
      )
      return list.length
    },
    setCurrentTab (tab) {
      this.currentTab = tab
      this.$store.dispatch('setCurrentTab', tab)
    },
    checkElementsCount (input) {
      this.componentConfig.AdditionalComponents.forEach((Component) => {
        if (Component.simpleView) {
          if (1 * Component.ElementsCount < 1 * Component.ElementsDamaged) {
            Component.ElementsDamaged = Component.ElementsCount
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .additional-content {
    padding: 30px;
  }

  .additional-content:empty {
    padding: 0;
  }

  .additional_page .select2-results__option {
    font-size: 12px;
  }
</style>
