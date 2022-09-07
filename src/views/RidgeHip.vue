<template>
  <NotificationText v-bind:component_id="'RidgeHip'" />

  <div class="central-content ridge_hip__page">
    <div class="ridge_wrapp">
      <div class="ridge_main">
        <div class="ridge-selector" v-show="HouseSections.length > 1">
          <Select2 v-model="currentSectionCode"
                   :options="HouseSections"
                   :settings="{ width: '340px', minimumResultsForSearch: -1 }"
                   @select="setActiveSection"/>
        </div>

        <div v-show="this.currentSection.scenario === 'scenario-2'">
          Ridge is not available for the current section.
          Please select next section.
        </div>
        <div class="field_row" v-show="this.currentSection.scenario !== 'scenario-2'">
          <div class="field">
            <div class="lebel">Ridge Length</div>
            <div>
              <input type="text" v-model="this.currentSection.RidgeLength"
                     readonly style="width: 340px">
            </div>
          </div>
          <div class="field">
            <div class="lebel">Hip Length</div>
            <div>
              <input type="text" v-model="this.currentSection.HipLength"
                     readonly style="width: 340px">
            </div>
          </div>
        </div>

        <div v-show="this.currentSection.scenario === 'scenario-1'">
          <div class="field_row">
            <div class="field">
              <div class="lebel">Ridge cap damaged</div>
              <div>
                <label class="switch" for="id1">
                  <input id="id1" type="checkbox" value="" v-model="this.currentSection.RidgeCapDamaged"
                         @change="setRidgeCapDamaged()">
                  <div class="slider red round"></div>
                  <div class="yesOrNo">
                    <span v-if="this.currentSection.RidgeCapDamaged">yes</span>
                    <span v-else>no</span>
                  </div>
                </label>
              </div>
            </div>

            <div class="field" v-show="this.currentSection.RidgeCapDamaged">
              <div class="lebel">Material</div>
              <div>
                <Select2 v-model="this.currentSection.RidgeCapMaterial"
                         :options="getRidgeCapMaterial()"
                         :settings="{ width: '250px', minimumResultsForSearch: -1 }"
                         @select="isEnableNextButton()"
                />
              </div>
            </div>

            <div class="field" v-show="this.currentSection.RidgeCapDamaged">
              <div class="lebel">Total Length Damaged</div>
              <div>
                <input type="text" @change="isEnableNextButton()"
                       v-model="this.currentSection.RidgeCapTotalLengthDamaged"
                       v-maska="FootAndInchesMask()" :placeholder="getFootAndInchesPlaceHolder()"
                       style="width:250px">
              </div>
            </div>
          </div>

          <div class="field_row">
            <div class="field">
              <div class="lebel">Ridge vent present</div>
              <div>
                <label class="switch" for="id26">
                  <input id="id26" type="checkbox" value="" v-model="this.currentSection.RidgeVentPresent"
                         @change="setRidgeVentPresent()">
                  <div class="slider red round"></div>
                  <div class="yesOrNo">
                    <span v-if="this.currentSection.RidgeVentPresent">yes</span>
                    <span v-else>no</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="field_row" v-show="this.currentSection.RidgeVentPresent">
            <div class="field">
              <div class="lebel">Ridge vent damaged</div>
              <div>
                <label class="switch" for="id2">
                  <input id="id2" type="checkbox" value="" v-model="this.currentSection.RidgeVentDamaged"
                         @change="setRidgeCapDamaged()">
                  <div class="slider red round"></div>
                  <div class="yesOrNo">
                    <span v-if="this.currentSection.RidgeVentDamaged">yes</span>
                    <span v-else>no</span>
                  </div>
                </label>
              </div>
            </div>
            <div class="field" v-show="this.currentSection.RidgeVentDamaged">
              <div class="lebel">Material</div>
              <div>
                <Select2 v-model="this.currentSection.RidgeVentMaterial"
                         :options="RidgeVentMaterials"
                         :settings="{ width: '250px', minimumResultsForSearch: -1 }"
                         @select="isEnableNextButton()"
                />
              </div>
            </div>
            <div class="field" v-show="this.currentSection.RidgeVentDamaged">
              <div class="lebel">Total Length Damaged</div>
              <div>
                <input type="text" @change="isEnableNextButton()"
                       v-model="this.currentSection.RidgeVentTotalLength"
                       v-maska="FootAndInchesMask()" :placeholder="getFootAndInchesPlaceHolder()"
                       style="width:250px">
              </div>
            </div>
          </div>
        </div>

        <div v-show="this.currentSection.scenario === 'scenario-3'">
          <div class="field_row">
            <div class="field" style="min-width: 170px;">
              <div class="lebel">Ridge cap damage</div>
              <div>
                <label class="switch" for="id1">
                  <input id="id1" type="checkbox" value="" v-model="this.currentSection.RidgeCapDamaged"
                         @change="setRidgeCapDamaged()">
                  <div class="slider red round"></div>
                  <div class="yesOrNo">
                    <span v-if="this.currentSection.RidgeCapDamaged">yes</span>
                    <span v-else>no</span>
                  </div>
                </label>
              </div>
            </div>

            <div class="field" v-show="this.currentSection.RidgeCapDamaged">
              <div class="lebel">Material</div>
              <div>
                <input type="text" placeholder="" readonly
                       v-model="this.currentSection.RidgeCapMaterial"
                       style="width:250px">
              </div>
            </div>

            <div class="field" v-show="this.currentSection.RidgeCapDamaged">
              <div class="lebel">Total Length Damage</div>
              <div>
                <input type="text" @change="updateClosureStripsLength()"
                       v-model="this.currentSection.RidgeCapTotalLengthDamaged"
                       v-maska="FootAndInchesMask()" :placeholder="getFootAndInchesPlaceHolder()"
                       style="width:245px">
              </div>
            </div>
          </div>

          <div class="field_row white_space">
            <div class="field" style="min-width: 170px;">
              <div class="lebel">Closure strips damage</div>
              <div>
                <label class="switch" for="id11">
                  <input id="id11" type="checkbox" value="" v-model="this.currentSection.ClosureStripsDamaged"
                         @change="setRidgeCapDamaged()">
                  <div class="slider red round"></div>
                  <div class="yesOrNo">
                    <span v-if="this.currentSection.ClosureStripsDamaged">yes</span>
                    <span v-else>no</span>
                  </div>
                </label>
              </div>
            </div>

            <div class="field" v-show="this.currentSection.ClosureStripsDamaged">
              <div class="lebel">Total length</div>
              <div>
                <input type="text" readonly
                       v-model="this.currentSection.ClosureStripsLengthDamaged"
                       v-maska="FootAndInchesMask()" :placeholder="getFootAndInchesPlaceHolder()"
                       style="width:250px">
              </div>
            </div>

            <div class="field" style="width: 250px;" v-show="this.currentSection.ClosureStripsDamaged">
              <div class="lebel">Closure strips vented</div>
              <div>
                <label class="switch" for="id12">
                  <input id="id12" type="checkbox" value="" v-model="this.currentSection.ClosureStripsVented">
                  <div class="slider red round"></div>
                  <div class="yesOrNo">
                    <span v-if="this.currentSection.ClosureStripsVented">yes</span>
                    <span v-else>no</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ridge_table__wrapp">
        <table class="table table-small ridge-table">
          <thead class="info-table-header">
            <th v-if="this.componentConfig.Sections.length > 1">Section</th>
            <th>Ridge length</th>
            <th>Hip length</th>
            <th>Photo</th>
          </thead>
          <tbody class="info-table-body">
            <tr class="section-row" v-for="section in this.componentConfig.Sections" :key="section.code">
              <td v-if="this.componentConfig.Sections.length > 1">
                <span>{{ section.name }}</span>
              </td>
              <td>
                <span v-if="section.RidgeLength !== undefined">
                  <span v-if="section.RidgeLength">{{ section.RidgeLength }}</span>
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <span v-if="section.HipLength !== undefined">
                  <span v-if="section.HipLength">{{ section.HipLength }}</span>
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <div class="exist_photo" v-bind:class="[renderPhotoStatus(section.id) ? 'yes' : 'no']"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="photo-additional-content">
      <PhotoGallery InfoText="Ridges and hips" :params="{ component: 'RidgesAndHips', section: currentSectionCode }" />
    </div>
  </div>

  <ButtonsMenu />

  <DescriptionSlider v-bind:component_id="'Ridge'"/>
</template>

<style></style>

<script>
import ButtonsMenu from '@/components/ButtonsMenu'
import PhotoGallery from '@/components/PhotoGallery'
import Select2 from 'vue3-select2-component'
import { maska } from 'maska'
import { Units } from '@/mixins/Units'
import NotificationText from '@/components/NotificationText'
import DescriptionSlider from '@/components/DescriptionSlider'
import { BaseComponent } from '@/mixins/BaseComponent'

export default {
  mixins: [Units, BaseComponent],
  components: {
    ButtonsMenu, Select2, PhotoGallery, NotificationText, DescriptionSlider
  },
  directives: {
    maska
  },
  data () {
    return {
      currentSectionCode: '',
      currentSection: {},
      componentConfig: {
        Sections: []
      },
      RidgeCapMaterials: [
        { id: 'Composition shingle', text: 'Composition shingle' },
        { id: 'High profile composition shingle', text: 'High profile composition shingle' }
      ],
      RidgeVentMaterials: [
        { id: 'Shingle overstyle', text: 'Shingle overstyle' },
        { id: 'Aluminum', text: 'Aluminum' }
      ],
      notification: 'Indicate condition and materials for the ridge and hip components. Measure and input total and damaged area lengths rounded up to the nearest foot. Take pictures of the components.',
      description: 'While lighting rods or satellite dishes are not considered part of the roof, they should still be listed as a part of the scope, as these components may need to be detached and installed during roof repair or replacement. Noting quantities of these components will assist the estimator with evaluating labor expenses.'
    }
  },
  beforeMount () {
    const CurrentScope = this.$store.getters.getCurrentScope
    if (CurrentScope.id === undefined) {
      this.$router.push('/scopes')
    }
    this.componentConfig = this.$store.getters.getComponentConfig('ScopeBuild')

    this.initComponentConfig()
    this.initScenario()
  },
  mounted () {
    this.isEnableNextButton()
    this.initComponent()
    this.$store.dispatch('setSection', this.currentSectionCode)
    this.defaultSelect()
  },
  computed: {
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
    initScenario () {
      this.detectScenario()
      this.detectScenarioSettings()
    },
    detectScenario () {
      if (this.currentSection.scenario === undefined || this.currentSection.scenario !== '') {
        // Scenario 2
        const Scenario2 = this.$store.getters.getRoofScopingScenarios.find(m => {
          return m.code === 'scenario-2'
        })
        if (Scenario2.roofTypes.includes(this.currentSection.code)) {
          this.currentSection.scenario = 'scenario-2'
          return true
        }

        // Scenario 3
        const Scenario3 = this.$store.getters.getRoofScopingScenarios.find(m => {
          return m.code === 'scenario-3'
        })
        if (Scenario3.materials.includes(this.currentSection.material.code)) {
          this.currentSection.scenario = 'scenario-3'
          return true
        }

        // Scenario 1
        this.currentSection.scenario = 'scenario-1'
      }
    },
    detectScenarioSettings () {
      if (this.currentSection.scenario === 'scenario-3') {
        // extend Ridge Cap Material
        if (this.currentSection.RidgeCapMaterial === undefined || this.currentSection.RidgeCapMaterial === '') {
          const material = this.$store.getters.getCoveringMaterials.sloped.find(m => {
            return m.code === this.currentSection.material.code
          })
          this.currentSection.RidgeCapMaterial = material.title !== undefined ? material.title : ''
        }
      }
    },
    isEnableNextButton () {
      let canBeEnabled = true
      this.componentConfig.Sections.forEach((section) => {
        if (section.scenario !== 'scenario-2') {
          // ridge cap damaged
          if (section.RidgeCapDamaged) {
            if (section.RidgeCapMaterial === undefined || section.RidgeCapMaterial === '') {
              canBeEnabled = false
            }
            if (section.RidgeCapTotalLengthDamaged === undefined || section.RidgeCapTotalLengthDamaged === '') {
              canBeEnabled = false
            }
          }
          // ridge vent damaged
          if (section.RidgeVentDamaged && section.scenario === 'scenario-1') {
            if (section.RidgeVentMaterial === undefined || section.RidgeVentMaterial === '') {
              canBeEnabled = false
            }
            if (section.RidgeVentTotalLength === undefined || section.RidgeVentTotalLength === '') {
              canBeEnabled = false
            }
          }
        }
      })

      if (canBeEnabled) {
        this.$store.dispatch('EnableNextStepButton')
      } else {
        this.$store.dispatch('DisableNextStepButton')
      }
    },
    showInfo () {
      const info = document.querySelector('.ridge')
      info.classList.toggle('active')
    },
    initComponentConfig () {
      this.currentSection = this.componentConfig.Sections[0]
      this.currentSectionCode = this.componentConfig.Sections[0].id
    },
    defaultSelect () {
      if (!this.currentSection.RidgeCapMaterial || this.currentSection.RidgeCapMaterial === '' || this.currentSection.RidgeCapMaterial.id) {
        this.currentSection.RidgeCapMaterial = this.getRidgeCapMaterial()[0].id
      }
      if (!this.currentSection.RidgeVentMaterial || this.currentSection.RidgeVentMaterial === '' || this.currentSection.RidgeVentMaterial.id) {
        this.currentSection.RidgeVentMaterial = this.RidgeVentMaterials[0].id
      }
      console.log(this.RidgeVentMaterials)
    },
    setActiveSection () {
      this.$store.dispatch('setSection', this.currentSectionCode)
      this.componentConfig.Sections.forEach((item) => {
        if (item.id === this.currentSectionCode) {
          this.currentSection = item
          this.initScenario()
          this.isEnableNextButton()
          return true
        }
      })
      this.defaultSelect()
    },
    renderPhotoStatus (sectionId) {
      const Photos = this.$store.getters.getCurrentScope.photos.filter(photo => {
        return (photo.component === 'RidgesAndHips') && photo.section === sectionId
      })
      return Array.isArray(Photos) && Photos.length > 0
    },
    updateClosureStripsLength () {
      // ClosureStripsLengthDamaged = RidgeCapTotalLengthDamaged * 2
      const inches = this.stringToInches(this.currentSection.RidgeCapTotalLengthDamaged)
      this.currentSection.ClosureStripsLengthDamaged = this.InchesToString(2 * inches)

      this.isEnableNextButton()
    },
    getRidgeCapMaterial () {
      // same as covering for metal roofs
      /* if (this.currentSection !== undefined && this.currentSection.material !== undefined) {
        const Scenario3 = this.$store.getters.getRoofScopingScenarios.find(m => {
          return m.code === 'scenario-3'
        })

        if (Scenario3.materials.includes(this.currentSection.material.code)) {
          let MaterialTitle = ''
          if (this.currentSection.material.title === undefined) {
            MaterialTitle = this.getMaterialTitle(this.currentSection.code, this.currentSection.material.code)
          } else {
            MaterialTitle = this.currentSection.material.title
          }

          this.RidgeCapMaterials.push({ id: MaterialTitle, text: MaterialTitle }) // Metal only
        }
      } */
      return this.RidgeCapMaterials
    },
    getMaterialTitle (sectionCode, materialCode) {
      let materials = this.$store.getters.getCoveringMaterials
      materials = sectionCode === 'flat' ? materials.flat : materials.sloped

      const selected = materials.find(item => item.code === materialCode)
      return selected === undefined ? '' : selected.title
    },
    setRidgeCapDamaged () {
      if (this.currentSection.RidgeCapDamaged === false) {
        this.currentSection.RidgeCapMaterial = ''
        this.currentSection.RidgeCapTotalLengthDamaged = ''
      } else {
        if (this.currentSection.RidgeCapMaterial === '') {
          this.detectScenarioSettings()
        }
      }

      if (this.currentSection.ClosureStripsDamaged === false) {
        this.currentSection.ClosureStripsVented = false
        this.currentSection.ClosureStripsLengthDamaged = ''
      }

      this.isEnableNextButton()
    },
    setRidgeVentPresent () {
      if (this.currentSection.RidgeVentPresent === false) {
        this.currentSection.RidgeVentDamaged = false
        this.currentSection.RidgeVentMaterial = ''
        this.currentSection.RidgeVentTotalLength = ''
      } else {
        this.currentSection.RidgeVentMaterial = this.RidgeVentMaterials[0].id
      }
    }
  }
}
</script>
