<template>
  <NotificationText v-bind:component_id="'SlopesDamage'" />

  <div class="central-content slope-page">
    <div class="slopes-top-menu">
      <ul class="content-tabs">
        <li @click="currentTab = 'details'" v-bind:class="[currentTab === 'details' ? 'selected' : '']">Details</li>
        <li @click="currentTab = 'damage'" v-bind:class="[currentTab === 'damage' ? 'selected' : '']">Damage</li>
      </ul>

      <Select2 v-model="currentSlopeId"
               :options="CurrentSectionSlopes"
               :settings="{ width: '375px', minimumResultsForSearch: -1 }"
               @select="setActiveSection"
               v-show="currentTab === 'damage'"
      />
    </div>

    <div class="slopes-component">
      <div class="content-tab-content" v-show="currentTab === 'details'" style="padding:0; width: 100%; display: block;">
        <RoofDrawingTool />
      </div>
      <div class="content-tab-content damage-tab" v-show="currentTab === 'damage'">
        <div class="content-config">
          <div class="field">
            <div class="lebel">
              Covering damage
            </div>
            <div>
              <label class="switch" for="id1">
                <input id="id1" type="checkbox" value="" v-model="currentSlope.CoveringDamaged"
                  @change="isEnableNextButton">
                <div class="slider red round"></div>
                <div class="yesOrNo">
                  <span v-if="currentSlope.CoveringDamaged">yes</span>
                  <span v-else>no</span>
                </div>
              </label>
            </div>
          </div>

          <div class="field_row" v-show="currentSlope.CoveringDamaged" style="width: 500px">
            <div class="field">
              <div class="lebel">Evaluate damage by</div>
              <div>
                <Select2 v-model="currentSlope.EvaluateDamageBy"
                         :options="EvaluateDamageTypes"
                         :settings="{ width: '200px', minimumResultsForSearch: -1 }"
                         @select="changeEvaluateDamage()"
                         v-if="canBeChangeEvaluateDamageBy()"
                />
                <input type="text" :value="getEvaluateDamageTitle(currentSlope.EvaluateDamageBy)" readonly
                       v-if="!canBeChangeEvaluateDamageBy()">
              </div>
            </div>

            <div class="field" v-show="currentSlope.EvaluateDamageBy === 'square'">
              <div class="lebel"># of hits per square</div>
              <div>
                <input type="text" placeholder="0" v-model="currentSlope.NumberOfHits">
              </div>
            </div>

            <div class="field" v-show="currentSlope.EvaluateDamageBy === 'area'">
              <div class="lebel">Length</div>
              <div>
                <input type="text" style="width: 80px;" v-model="currentSlope.AreaLength" @change="updateArea"
                       v-maska="FootAndInchesMask()" :placeholder="getFootAndInchesPlaceHolder()">
              </div>
            </div>

            <div class="field" v-show="currentSlope.EvaluateDamageBy === 'area'">
              <div class="lebel">Width</div>
              <div>
                <input type="text" style="width: 80px;" v-model="currentSlope.AreaWidth" @change="updateArea"
                       v-maska="FootAndInchesMask()" :placeholder="getFootAndInchesPlaceHolder()">
              </div>
            </div>

            <div class="field" v-show="currentSlope.EvaluateDamageBy === 'area'">
              <div class="lebel">Area,SQ FT</div>
              <div>
                <input type="text" placeholder="0" style="width: 80px;" readonly v-model="currentSlope.EvaluateArea">
              </div>
            </div>

            <!-- <div class="field">
              <div class="lebel">Corrective actions</div>
              <div>
                <Select2 v-model="currentSlope.CorrectiveAction" :options="CorrectiveActions"
                  :settings="{ width: '200px', minimumResultsForSearch: -1 }" />
              </div>
            </div> -->
          </div>

          <div class="field_row" v-show="currentSlope.CoveringDamaged && currentSection.material.config.underlaymentPresent">
            <div class="field">
              <div class="lebel">Underlayment damage</div>
              <div>
                <label class="switch" for="id123">
                  <input id="id123" type="checkbox" value="" v-model="currentSlope.UnderlaymentDamaged">
                  <div class="slider red round"></div>
                  <div class="yesOrNo">
                    <span v-if="currentSlope.UnderlaymentDamaged">yes</span>
                    <span v-else>no</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="slope_table__wrapp">
          <table class="table table-small slope-table">
            <thead class="info-table-header">
              <th v-if="this.componentConfig.Sections.length > 1">Section</th>
              <th>Slope</th>
              <th>Damage</th>
              <th>Photo</th>
            </thead>
            <tbody class="info-table-body" v-for="section in this.componentConfig.Sections" :key="section.code">
              <tr class="section-row" v-for="(slope, index) in section.slopes" :key="slope.code">
                <td v-if="this.componentConfig.Sections.length > 1">
                  <span v-if="index === 0">{{ section.name }}</span>
                </td>
                <td>{{ slope.name }}</td>
                <td>
                  <span class="damage_cell" v-if="slope.CoveringDamaged !== undefined"
                    v-bind:class="[slope.CoveringDamaged ? 'yes' : 'no']">
                    <span v-if="slope.CoveringDamaged">Yes</span><span v-else>No</span>
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <div class="exist_photo" v-bind:class="[renderPhotoStatus(slope.id) ? 'yes' : 'no']"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="photo-additional-content">
          <PhotoGallery InfoText="Roof surface and test square" :params="{ component: 'SlopesDamageSurface', section: currentSlopeId }" />
          <PhotoGallery InfoText="Pitch gauge" :params="{ component: 'SlopesDamagePitch', section: currentSlopeId }" />
        </div>
      </div>
    </div>
  </div>

  <div class="bottom-buttons">
    <button class="button" @click="BackStep">Back</button>
    <button id="next-button" class="button next" @click="NextStep">Next</button>
  </div>

  <DescriptionSlider v-bind:component_id="'Covering'"/>
</template>

<script>
import RoofDrawingTool from '@/components/RoofDrawingTool'
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
    Select2, PhotoGallery, RoofDrawingTool, NotificationText, DescriptionSlider
  },
  directives: {
    maska
  },
  data () {
    return {
      currentTab: 'details',
      currentSlopeId: '',
      currentSlope: {},
      currentSection: {},
      componentConfig: {
        Sections: []
      },
      notification: 'Verify and input slope pitch and dimensions',
      description: 'Drip edge is installed at the rake and eave of the non-metallic roofs. It provides both aesthetical finish to the roof edge and an efficient method of shedding water. When scoping the roof, note the drip edge material, total length and take photos of the damage.'
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
    this.$store.dispatch('setComponentValue', { component: 'ComponentStep', value: 'SlopesDamage' })
    this.currentTab = 'damage'
    this.isEnableNextButton()
    this.changeEvaluateDamage()
    this.initComponent()
    this.$store.dispatch('setSection', this.currentSlopeId)
  },
  computed: {
    EvaluateDamageTypes () {
      const types = [
        { id: 'area', text: 'Area' }
      ]

      // Test square and Number of hits - Hail and Wind only, non-metal roofs
      if (['3', '6'].includes(this.$store.getters.getCurrentScope.damage_type_id)) {
        if (this.currentSection !== undefined && this.currentSection.material !== undefined) {
          const Scenario3 = this.$store.getters.getRoofScopingScenarios.find(m => {
            return m.code === 'scenario-3'
          })

          if (!Scenario3.materials.includes(this.currentSection.material.code)) {
            types.push({ id: 'square', text: 'Test square' })
          }
        }
      }
      return types
    },
    CorrectiveActions () {
      const list = []
      this.$store.getters.getCorrectiveActions.forEach((action) => {
        list.push(
          { id: action.code, text: action.title }
        )
      })
      return list
    },
    CurrentSectionSlopes () {
      const slopes = []
      this.componentConfig.Sections.forEach((section) => {
        if (Array.isArray(section.slopes)) {
          section.slopes.forEach((slope) => {
            // create default
            if (slope.UnderlaymentDamaged === undefined) {
              slope.UnderlaymentDamaged = false
            }
            if (slope.EvaluateDamageBy === undefined) {
              slope.EvaluateDamageBy = 'area'
            }

            // generate names
            slopes.push({
              id: slope.id,
              name: this.componentConfig.Sections.length > 1 ? section.name + ', ' + slope.name : slope.name
            })
          })
        }
      })

      const list = []
      slopes.forEach((slope) => {
        list.push(
          { id: slope.id, text: slope.name }
        )
      })
      return list
    }
  },
  methods: {
    canBeChangeEvaluateDamageBy () {
      let slopeIndex = 0
      this.currentSection.slopes.forEach((slope, index) => {
        if (slope.id === this.currentSlopeId) {
          slopeIndex = index
        }
      })
      return (slopeIndex === 0)
    },
    isEnableNextButton () {
      let canBeEnabled = true
      this.componentConfig.Sections.forEach((section) => {
        if (Array.isArray(section.slopes)) {
          section.slopes.forEach((slope) => {
            if (slope.CoveringDamaged === undefined) {
              canBeEnabled = false
            }
          })
        } else {
          canBeEnabled = false
        }
      })

      if (canBeEnabled) {
        this.$store.dispatch('EnableNextStepButton')
      } else {
        this.$store.dispatch('DisableNextStepButton')
      }
    },
    showInfo () {
      const info = document.querySelector('.slope')

      info.classList.toggle('active')
    },
    initComponentConfig () {
      this.currentSection = this.componentConfig.Sections[0]
      this.currentSlope = this.componentConfig.Sections[0].slopes[0]
      this.currentSlopeId = this.currentSlope.id
      this.setActiveSection()
    },
    setActiveSection () {
      this.$store.dispatch('setSection', this.currentSlopeId)
      this.componentConfig.Sections.forEach((section) => {
        section.slopes.forEach((slope) => {
          if (slope.id === this.currentSlopeId) {
            if (slope.CoveringDamaged === undefined) {
              slope.CoveringDamaged = false
            }
            this.currentSection = section
            this.currentSlope = slope
            this.canBeChangeEvaluateDamageBy()
            return true
          }
        })
      })
      this.isEnableNextButton()
      this.changeEvaluateDamage()
    },
    renderPhotoStatus (sectionId) {
      const Photos = this.$store.getters.getCurrentScope.photos.filter(photo => {
        return (photo.component === 'SlopesDamageSurface' || photo.component === 'SlopesDamagePitch') && photo.section === sectionId
      })
      return Array.isArray(Photos) && Photos.length > 0
    },
    changeEvaluateDamage () {
      try {
        const GalleryTestSquare = document.querySelector('.photo-gallery-place')
        GalleryTestSquare.style.display = this.currentSlope.EvaluateDamageBy === 'square' ? 'block' : 'none'
      } catch (e) {}

      // setup EvaluateDamageBy for all slopes
      this.componentConfig.Sections.forEach((section) => {
        section.slopes.forEach((slope) => {
          if (slope.id !== this.currentSlopeId) {
            slope.EvaluateDamageBy = this.currentSlope.EvaluateDamageBy
          }
        })
      })
    },
    getEvaluateDamageTitle (code) {
      return this.currentSlope.EvaluateDamageBy === 'square' ? 'Test square' : 'Area'
    },
    updateArea () {
      if (this.currentSlope !== undefined && this.currentSlope.AreaLength !== undefined && this.currentSlope.AreaWidth !== undefined) {
        this.currentSlope.EvaluateArea = this.getFootArea(this.currentSlope.AreaLength, this.currentSlope.AreaWidth)
      } else {
        this.currentSlope.EvaluateArea = 0
      }
    },
    NextStep () {
      if (document.querySelector('#next-button').classList.contains('active')) {
        this.emitter.emit('runExportCanvasPreview')

        this.$store.dispatch('setCompleteStep', this.$route.name)
        this.$store.dispatch('NextStep')
        this.$store.dispatch('saveConfig')
      }
    },
    BackStep () {
      this.$store.dispatch('BackStep')
    }
  }
}
</script>
