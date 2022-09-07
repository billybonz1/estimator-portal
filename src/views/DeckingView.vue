<template>
  <NotificationText v-bind:component_id="'DeckingView'" />

  <div class="central-content decking_page">
    <div class="field_row mt_0">
      <div class="field">
        <div class="lebel">Type</div>
        <div>
          <Select2 v-model="componentConfig.Decking.Type"
                   :options="DeckingTypes"
                   @select="changeType()"
                   :settings="{ width: '192px', minimumResultsForSearch: -1 }" />
        </div>
      </div>

      <div class="field" v-show="componentConfig.Decking.Type === 'Spaced decking' || componentConfig.Decking.Type === 'Purlins'">
        <div class="lebel">Profile</div>
        <div>
          <Select2 v-model="componentConfig.Decking.Profile"
                   :options="DeckingProfileType"
                   :settings="{ width: '192px', minimumResultsForSearch: -1 }" />
        </div>
      </div>

      <div class="field" v-show="componentConfig.Decking.Type === 'OSB' || componentConfig.Decking.Type === 'Plywood'">
        <div class="lebel">Thickness</div>
        <div>
          <Select2 v-model="componentConfig.Decking.Thickness"
                   :options="DeckingThickness"
                   :settings="{ width: '192px', minimumResultsForSearch: -1 }" />
        </div>
      </div>
    </div>

    <div class="field_row">
      <div class="field">
        <div class="lebel">Decking damage</div>
        <div>
          <label class="switch" for="id1">
            <input id="id1" type="checkbox" value="" v-model="componentConfig.Decking.Damaged" @change="isEnableNextButton">
            <div class="slider red round"></div>
            <div class="yesOrNo">
              <span v-if="componentConfig.Decking.Damaged">yes</span>
              <span v-else>no</span>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div v-show="componentConfig.Decking.Damaged">
      <div class="field_row">
        <Select2 v-model="currentSlopeId"
                 :options="CurrentSectionSlopes"
                 :settings="{ width: '400px', minimumResultsForSearch: -1 }"
                 @select="setActiveSection"/>
      </div>

      <div class="field_row with_deck__table">
        <div class="inner_field__wrapp">
          <div class="field with_checkbox">
            <div class="lebel">Damage</div>
            <div>
              <label class="switch" for="id2">
                <input id="id2" type="checkbox" value="" v-model="currentSlope.DeckingDamaged" @change="setSlopeDamaged()">
                <div class="slider red round"></div>
                <div class="yesOrNo">
                  <span v-if="currentSlope.DeckingDamaged">yes</span>
                  <span v-else>no</span>
                </div>
              </label>
            </div>
          </div>

          <div class="field" v-if="currentSlope.DeckingDamaged">
            <div class="lebel">Length</div>
            <div>
              <input type="text" style="width: 80px;" @change="updateArea"
                     v-model="currentSlope.DeckingDamagedLength"
                     v-maska="FootAndInchesMask()" :placeholder="getFootAndInchesPlaceHolder()">
            </div>
          </div>

          <div class="field" v-if="currentSlope.DeckingDamaged">
            <div class="lebel">Width</div>
            <div>
              <input type="text" style="width: 80px;" @change="updateArea"
                     v-model="currentSlope.DeckingDamagedWidth"
                     v-maska="FootAndInchesMask()" :placeholder="getFootAndInchesPlaceHolder()">
            </div>
          </div>

          <div class="field" v-if="currentSlope.DeckingDamaged">
            <div class="lebel">Area,SQ FT</div>
            <div>
              <input type="text" placeholder="0" style="width: 80px;" readonly v-model="currentSlope.DeckingDamagedArea">
            </div>
          </div>

          <!-- <div class="field">
            <div class="lebel">Corrective action</div>
            <div>
              <Select2 v-model="currentSlope.DeckingCorrectiveAction"
                       :options="CorrectiveActions"
                       :settings="{ width: '200px', minimumResultsForSearch: -1 }" />
            </div>
          </div> -->
        </div>
        <table class="table table-small decking-table">
          <thead class="info-table-header">
            <th v-if="this.componentConfig.Sections.length > 1">Section</th>
            <th>Slope</th>
            <th>Area</th>
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
                <span v-if="slope.DeckingDamagedArea !== undefined">
                  <span v-if="slope.DeckingDamagedArea">{{ slope.DeckingDamagedArea }}</span>
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <span class="damage_cell" v-if="slope.DeckingDamaged !== undefined"
                  v-bind:class="[slope.DeckingDamaged ? 'yes' : 'no']">
                  <span v-if="slope.DeckingDamaged">Yes</span><span v-else>No</span>
                </span>
                <span v-else>-</span>
              </td>
              <!--<td>
                <span v-if="slope.DeckingCorrectiveAction !== undefined">
                  <span v-if="slope.DeckingCorrectiveAction">{{ slope.DeckingCorrectiveAction }}</span>
                </span>
                <span v-else>-</span>
              </td> -->
              <td>
                <div class="exist_photo" v-bind:class="[renderPhotoStatus(slope.id) ? 'yes' : 'no']"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="photo-additional-content">
      <PhotoGallery InfoText="Decking" :params="{ component: 'DeckingView', section: currentSlopeId }" />
    </div>
  </div>

  <ButtonsMenu />

  <DescriptionSlider v-bind:component_id="'Decking'"/>
</template>

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
      currentSlopeId: '',
      currentSlope: {},
      currentSection: {},
      componentConfig: {
        Sections: [],
        Decking: {
          Type: 'Plywood'
        }
      },
      DeckingThickness: [{ id: '1/2"', text: '1/2"' }, { id: '5/8”', text: '5/8”' }, { id: '3/4"', text: '3/4"' }],
      DeckingProfile: [{ id: '1”x6” boards', text: '1”x6” boards' }, { id: '1”x8” boards', text: '1”x8” boards' }],
      DeckingProfilePurlins: [{ id: '2”x4” studs', text: '2”x4” studs' }, { id: '2”x6” studs', text: '2”x6” studs' }],
      notification: 'Identify if decking is damaged. Specify decking material and parameters and take measurements/photos of the damage for each slope.',
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
    this.$store.dispatch('setComponentValue', { component: 'ComponentStep', value: 'DeckingView' })
    this.initComponent()
    this.setActiveSection()
  },
  computed: {
    DeckingProfileType () {
      return this.componentConfig.Decking.Type === 'Spaced decking' ? this.DeckingProfile : this.DeckingProfilePurlins
    },
    DeckingTypes () {
      const types = [
        { id: 'Plywood', text: 'Plywood' },
        { id: 'Spaced decking', text: 'Spaced decking' },
        { id: 'OSB', text: 'OSB' }
      ]

      // 'Purlins' for Metal only materials
      if (this.currentSection !== undefined && this.currentSection.material !== undefined) {
        const Scenario3 = this.$store.getters.getRoofScopingScenarios.find(m => {
          return m.code === 'scenario-3'
        })

        if (Scenario3.materials.includes(this.currentSection.material.code)) {
          types.push({ id: 'Purlins', text: 'Purlins' }) // Metal only
        }
      }
      return types
    },
    CurrentSectionSlopes () {
      const slopes = []
      this.componentConfig.Sections.forEach((section) => {
        if (Array.isArray(section.slopes)) {
          section.slopes.forEach((slope) => {
            slopes.push({
              id: slope.id,
              name: this.componentConfig.Sections.length > 1 ? section.name + ',' + slope.name : slope.name
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
    },
    CorrectiveActions () {
      const list = []
      this.$store.getters.getCorrectiveActions.forEach((action) => {
        list.push(
          { id: action.title, text: action.title }
        )
      })
      return list
    }
  },
  methods: {
    changeType () {
      this.componentConfig.Decking.Profile = this.DeckingProfileType[0].id
    },
    isEnableNextButton () {
      let canBeEnabled = true

      if (this.componentConfig.Decking.Damaged !== undefined && this.componentConfig.Decking.Damaged) {
        this.componentConfig.Sections.forEach((section) => {
          section.slopes.forEach((slope) => {
            if (slope.DeckingDamaged === undefined) {
              canBeEnabled = false
            }
          })
        })
      }

      if (canBeEnabled) {
        this.$store.dispatch('EnableNextStepButton')
      } else {
        this.$store.dispatch('DisableNextStepButton')
      }
    },
    showInfo () {
      const info = document.querySelector('.decking')
      info.classList.toggle('active')
    },
    initComponentConfig () {
      this.currentSection = this.componentConfig.Sections[0]
      this.currentSlope = this.componentConfig.Sections[0].slopes[0]
      this.currentSlopeId = this.currentSlope.id

      if (this.componentConfig.Decking === undefined) {
        this.componentConfig.Decking = {
          Type: 'Plywood'
        }
        this.componentConfig.Decking.Thickness = this.DeckingThickness[0].id
        this.componentConfig.Decking.Profile = this.DeckingProfileType[0].id
      }
    },
    setActiveSection () {
      this.$store.dispatch('setSection', this.currentSlopeId)
      this.componentConfig.Sections.forEach((section) => {
        section.slopes.forEach((slope) => {
          if (slope.id === this.currentSlopeId) {
            this.currentSection = section
            this.currentSlope = slope
            if (this.currentSlope.DeckingDamaged === undefined) {
              this.currentSlope.DeckingDamaged = false
            }

            this.isEnableNextButton()
            return true
          }
        })
      })
    },
    updateArea () {
      if (this.currentSlope !== undefined && this.currentSlope.DeckingDamagedLength !== undefined && this.currentSlope.DeckingDamagedWidth !== undefined) {
        this.currentSlope.DeckingDamagedArea = this.getFootArea(
          this.currentSlope.DeckingDamagedLength,
          this.currentSlope.DeckingDamagedWidth
        )
      }
    },
    renderPhotoStatus (sectionId) {
      const Photos = this.$store.getters.getCurrentScope.photos.filter(photo => {
        return (photo.component === 'DeckingView') && photo.section === sectionId
      })
      return Array.isArray(Photos) && Photos.length > 0
    },
    setSlopeDamaged () {
      if (this.currentSlope.DeckingDamaged === false) {
        this.currentSlope.DeckingDamagedLength = ''
        this.currentSlope.DeckingDamagedWidth = ''
        this.currentSlope.DeckingDamagedArea = ''
      }

      this.isEnableNextButton()
    }
  }
}
</script>
