<template>
  <NotificationText v-bind:component_id="'UnderlaymentTrim'" />

  <div class="central-content trim_page">
    <div class="underlayment-trim">
      <div class="underlayment-trim-left">
        <div class="section-selector" v-show="SectionsCount > 1">
          <Select2 v-model="currentSectionCode"
                   :options="HouseSections"
                   :settings="{ width: '375px', minimumResultsForSearch: -1 }"
                   @select="setActiveSection"/>
        </div>

        <div class="underlayment-section__1" >
          <div class="materials-gallery-item active" v-if="SectionMaterial.code !== ''">
            <div class="title">{{ SectionMaterial.title }}</div>
            <img :src="SectionMaterial.img" :alt="SectionMaterial.title" :title="SectionMaterial.title"/>
            <div class="active-ico"></div>
          </div>
          <div class="underlayment_fields__1" v-bind:class="{three_items: SectionMaterial.shape !== undefined}">
            <div class="number-of-layers" v-show="SectionMaterial.layers.length > 0">
              <div class="field">
                <div class="lebel">Number of layers</div>
                <Select2 v-model="currentSection.material.config.layers"
                         :options="SectionMaterial.layers"
                         :settings="{ width: '330px', minimumResultsForSearch: -1 }" />
              </div>
            </div>

            <div class="thickness" v-show="SectionMaterial.thickness.length > 0">
              <div class="field">
                <div class="lebel">Thickness/Gauge</div>
                <Select2 v-model="currentSection.material.config.thickness"
                         :options="SectionMaterial.thickness"
                         :settings="{ width: '330px', minimumResultsForSearch: -1 }" />
              </div>
            </div>

            <div class="shape" v-show="SectionMaterial.shape !== undefined">
              <div class="field">
                <div class="lebel">Shape/Profile</div>
                <Select2 v-model="currentSection.material.config.shape"
                         :options="SectionMaterial.shape"
                         :settings="{ width: '330px', minimumResultsForSearch: -1 }" />
              </div>
            </div>

            <div class="parapet">
              <div class="field" v-if="currentSection.code === 'flat'">
                <div class="lebel">Parapet present</div>
                <div>
                  <label class="switch" for="checkbox1p">
                    <input id="checkbox1p" type="checkbox" name="" value="" v-model="currentSection.Parapet">
                    <div class="slider round"></div>
                    <div class="yesOrNo">
                      <span v-if="currentSection.Parapet">yes</span>
                      <span v-else>no</span>
                    </div>
                  </label>
                </div>
              </div>

              <div class="field" v-if="currentSection.Parapet !== undefined && currentSection.Parapet" style="margin-left: 50px;">
                <div class="lebel">
                  Height of parapet
                </div>
                <div>
                  <input type="text" v-model="currentSection.ParapetHeight" placeholder="0'00''" style="width: 120px;">
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="underlayment_table__wrapp" v-show="SectionsCount > 1">
        <table class="table table-small underlayment-table">
          <thead class="info-table-header">
            <th>Section</th>
            <th>Type</th>
            <th>Photo</th>
          </thead>
          <tbody class="info-table-body">
            <tr class="section" v-for="section in this.componentConfig.Sections" :key="section.code">
              <td>{{ section.name }}</td>
              <td>
                <span v-if="section.material.config !== undefined && section.material.config.underlayment_code !== undefined">
                  {{ section.material.config.underlayment_code }}
                </span>
              </td>
              <td>
                <div class="exist_photo" v-bind:class="[renderPhotoStatus(section.id) ? 'yes' : 'no']"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="material_underlayment__wrapp">
      <div class="underlayment" v-bind:class="{type_and_thickness: SectionMaterial.UnderlaymentMaterials.length > 0 && SectionMaterial.UnderlaymentThickness.length > 0}">
        <h2>{{ currentSection.code === 'flat' ? 'Insulation' : 'Felt'}}</h2>
        <div class="present" v-show="SectionMaterial.UnderlaymentMaterials.length > 0">
          <div class="present_box">
            <div class="field">
              <div class="lebel">
                Present?
              </div>
              <div>
                <label class="switch" for="checkbox_present">
                  <input id="checkbox_present" type="checkbox" name="" value=""
                         v-model="currentSection.material.config.underlaymentPresent"
                         @change="setUnderlaymentPresent()"
                  >
                  <div class="slider round"></div>
                  <div class="yesOrNo">
                    <span v-if="currentSection.material.config.underlaymentPresent">yes</span>
                    <span v-else>no</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="field" v-if="currentSection.material.config.underlaymentPresent">
            <div class="lebel">Type</div>
            <Select2 @select="changeUnderlaymentMaterial"
                     v-model="currentSection.material.config.underlayment_code"
                     :options="UnderlaymentMaterials"
                     :settings="{ width: '100%', minimumResultsForSearch: -1 }" />
          </div>
        </div>
        <div class="thickness" v-show="SectionMaterial.UnderlaymentThickness.length > 0">
          <div class="field">
            <div class="lebel">Thickness</div>
            <Select2 @select="changeUnderlaymentMaterial"
                     v-model="currentSection.material.config.underlayment_thickness"
                     :options="SectionMaterial.UnderlaymentThickness"
                     :settings="{ width: '100%', minimumResultsForSearch: -1 }" />
          </div>
        </div>
      </div>

      <div class="trim" v-show="SectionMaterial.trim !== undefined">
        <h2>Trim</h2>
        <div class="present" v-show="SectionMaterial.trim !== undefined && SectionMaterial.trim.EaveTrim !== undefined || SectionMaterial.trim !== undefined && SectionMaterial.trim.EaveTrimLength !== undefined">
          <div class="present_box" v-show="SectionMaterial.trim !== undefined && SectionMaterial.trim.EaveTrim !== undefined">
            <div class="field">
              <div class="lebel">Eave trim present</div>
              <div>
                <label class="switch" for="checkbox1">
                  <input id="checkbox1" type="checkbox" name="" value="" v-model="currentSection.material.config.EaveTrim">
                  <div class="slider round"></div>
                  <div class="yesOrNo">
                    <span v-if="currentSection.material.config.EaveTrim">yes</span>
                    <span v-else>no</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="field" v-show="SectionMaterial.trim !== undefined && SectionMaterial.trim.EaveTrimLength !== undefined && currentSection.material.config.EaveTrim">
            <div class="lebel">
              Length of eave trim
            </div>
            <div>
              <input type="text" inputmode="numeric" v-model="currentSection.material.config.EaveTrimLength">
            </div>
          </div>
        </div>
        <div class="rake" v-show="SectionMaterial.trim !== undefined && SectionMaterial.trim.RakeTrim !== undefined || SectionMaterial.trim !== undefined && SectionMaterial.trim.RakeTrimLength !== undefined">
          <div class="present_box">
            <div class="field">
              <div class="lebel">
                Rake trim present
              </div>
              <div>
                <label class="switch" for="checkbox3">
                  <input id="checkbox3" type="checkbox" name="" value="" v-model="currentSection.material.config.RakeTrim">
                  <div class="slider round"></div>
                  <div class="yesOrNo">
                    <span v-if="currentSection.material.config.RakeTrim">yes</span>
                    <span v-else>no</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="field" v-show="SectionMaterial.trim !== undefined && SectionMaterial.trim.RakeTrimLength !== undefined && currentSection.material.config.RakeTrim">
            <div class="lebel">
              Length of rake trim
            </div>
            <div>
              <input type="text" inputmode="numeric" v-model="currentSection.material.config.RakeTrimLength">
            </div>
          </div>
        </div>
        <div class="drip" v-show="SectionMaterial.trim !== undefined && SectionMaterial.trim.DripEdge !== undefined">
          <div class="field">
            <div class="lebel">
              Drip Edge
            </div>
            <div>
              <label class="switch" for="checkbox6">
                <input id="checkbox6" type="checkbox" name="" value="" v-model="currentSection.material.config.DripEdge">
                <div class="slider round"></div>
                <div class="yesOrNo">
                  <span v-if="currentSection.material.config.DripEdge">yes</span>
                  <span v-else>no</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div class="ice" v-show="SectionMaterial.trim !== undefined && SectionMaterial.trim.IceAndWaterShield !== undefined">
          <div class="field">
            <div class="lebel">
              Ice and water shield
            </div>
            <div>
              <label class="switch" for="checkbox5">
                <input id="checkbox5" type="checkbox" name="" value="" v-model="currentSection.material.config.IceAndWaterShield">
                <div class="slider round"></div>
                <div class="yesOrNo">
                  <span v-if="currentSection.material.config.IceAndWaterShield">yes</span>
                  <span v-else>no</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="photo-additional-content">
      <PhotoGallery InfoText="Roof edge and shingle gauge"
                    :params="{ component: 'Underlayment', section: this.currentSection.id }" />
    </div>
  </div>

  <ButtonsMenu />

  <DescriptionSlider v-bind:component_id="'Covering'"/>
</template>

<script>
import ButtonsMenu from '@/components/ButtonsMenu'
import PhotoGallery from '@/components/PhotoGallery'
import Select2 from 'vue3-select2-component'
import NotificationText from '@/components/NotificationText'
import DescriptionSlider from '@/components/DescriptionSlider'
import { BaseComponent } from '@/mixins/BaseComponent'

export default {
  mixins: [BaseComponent],
  components: {
    ButtonsMenu, Select2, PhotoGallery, NotificationText, DescriptionSlider
  },
  data () {
    return {
      currentSectionCode: '',
      currentSection: {
        material: {
          code: '',
          config: {
            thickness: '24ga'
          }
        }
      },
      SectionMaterial: {
        code: '',
        layers: [],
        thickness: [],
        options: [],
        UnderlaymentMaterials: [],
        UnderlaymentThickness: []
      },
      UnderlaymentMaterialsIndex: 0,
      componentConfig: {
        Sections: []
      },
      notification: 'Select underlayment type and populate relevant parameters for underlayment and trim. Once completed, take photographs of the roof edge to show details of the selected items.',
      description: 'Ice and water shield is a waterproof membrane used to protect the roof from ice and water damage. Its main purpose is to protect roof decking if water gets underneath roofing material (asphalt shingles, metal roof, etc.). Ice and water shield is typically installed at the rake edge of the roof and extends at least 24” inside the exterior wall line of the building.'
    }
  },
  beforeMount () {
    this.componentConfig = this.$store.getters.getComponentConfig('ScopeBuild')
  },
  mounted () {
    this.$store.dispatch('setComponentValue', { component: 'ComponentStep', value: 'UnderlaymentTrim' })
    this.initComponentConfig()
    this.initComponent()
    this.$store.dispatch('setSection', this.currentSectionCode)
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
    },
    UnderlaymentMaterials () {
      const list = []
      if (this.SectionMaterial !== undefined && Array.isArray(this.SectionMaterial.UnderlaymentMaterials)) {
        this.SectionMaterial.UnderlaymentMaterials.forEach((section) => {
          list.push(
            { id: section.type, text: section.type }
          )
        })
      }
      return list
    },
    UnderlaymentThickness () {
      const list = []
      if (this.SectionMaterial !== undefined && Array.isArray(this.SectionMaterial.UnderlaymentMaterials)) {
        this.SectionMaterial.UnderlaymentMaterials.forEach((section) => {
          list.push(
            { id: section.type, text: section.type }
          )
        })
      }
      return list
    }
  },
  methods: {
    initComponentConfig () {
      this.currentSection = this.componentConfig.Sections[0]
      this.currentSectionCode = this.componentConfig.Sections[0].id
      this.setActiveMaterialSettings()
      if (!this.currentSection.material.config.thickness || this.currentSection.material.config.thickness === '' || this.SectionMaterial.thickness.indexOf(this.currentSection.material.config.thickness) === -1) {
        this.currentSection.material.config.thickness = this.SectionMaterial.thickness[0]
      }
      if (this.SectionMaterial.shape && (!this.currentSection.material.config.shape || this.currentSection.material.config.shape === '' || this.SectionMaterial.shape.indexOf(this.currentSection.material.config.shape) === -1)) {
        this.currentSection.material.config.shape = this.SectionMaterial.shape[0]
      }
    },
    setActiveSection () {
      this.$store.dispatch('setSection', this.currentSectionCode)
      this.componentConfig.Sections.forEach((item) => {
        if (item.id === this.currentSectionCode) {
          this.currentSection = item
          this.setActiveMaterialSettings()
          return true
        }
      })
    },
    showInfo () {
      const info = document.querySelector('.underlayment')
      info.classList.toggle('active')
    },
    setActiveMaterialSettings () {
      let materials = this.$store.getters.getCoveringMaterials
      materials = this.currentSection.code === 'flat' ? materials.flat : materials.sloped

      this.SectionMaterial = materials.find(item => item.code === this.currentSection.material.code)
      // console.log(this.SectionMaterial)
      const UnderlaymentMaterials = this.$store.getters.getUnderlaymentMaterials
      this.SectionMaterial.UnderlaymentMaterials = this.currentSection.code === 'flat' ? UnderlaymentMaterials.flat : UnderlaymentMaterials.sloped

      // create default materials model values
      if (this.currentSection.material.config === undefined) {
        this.currentSection.material.config = this.SectionMaterial.defaultConfig
      }

      this.SectionMaterial.options = []
      this.SectionMaterial.UnderlaymentMaterials.forEach((item) => {
        this.SectionMaterial.options.push(item.type)
      })

      this.changeUnderlaymentMaterial()
      this.isEnableNextButton()
    },
    changeUnderlaymentMaterial () {
      if (this.currentSection.material.config.underlayment_code !== undefined) {
        const type = this.SectionMaterial.UnderlaymentMaterials.find(item => {
          return item.type === this.currentSection.material.config.underlayment_code
        })
        this.SectionMaterial.UnderlaymentThickness = type !== undefined && Array.isArray(type.thickness) ? type.thickness : []
      } else {
        this.SectionMaterial.UnderlaymentThickness = []
      }
    },
    isEnableNextButton () {
      let canBeEnabled = true
      this.componentConfig.Sections.forEach((item) => {
        if (item.material.config === undefined || item.material.config.underlayment_code === undefined) {
          canBeEnabled = false
        }
      })

      if (canBeEnabled) {
        this.$store.dispatch('EnableNextStepButton')
      }
    },
    renderPhotoStatus (sectionId) {
      const Photos = this.$store.getters.getCurrentScope.photos.filter(photo => {
        return photo.component === 'Underlayment' && photo.section === sectionId
      })
      return Array.isArray(Photos) && Photos.length > 0
    },
    setUnderlaymentPresent () {
      if (this.currentSection.material.config.underlaymentPresent === false) {
        this.currentSection.material.config.underlayment_code = ''
        this.currentSection.slopes.forEach((slope) => {
          slope.UnderlaymentDamaged = false
        })
      } else {
        const list = this.getUnderlaymentMaterials()
        this.currentSection.material.config.underlayment_code = list[0].id
      }
    },
    getUnderlaymentMaterials () {
      const list = []
      if (this.SectionMaterial !== undefined && Array.isArray(this.SectionMaterial.UnderlaymentMaterials)) {
        this.SectionMaterial.UnderlaymentMaterials.forEach((section) => {
          list.push(
            { id: section.type, text: section.type }
          )
        })
      }
      return list
    }
  }
}
</script>
