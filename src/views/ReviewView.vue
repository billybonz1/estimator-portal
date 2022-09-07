<template>
  <NotificationText v-bind:component_id="'ReviewView'" />
  <div class="review_head__line">
    <ul class="content-tabs">
      <li v-for="(tab, index) in getTabs" :key="'tab-' + index"
          @click="selectMainTab(tab)"
          v-bind:class="[currentTab === tab ? 'selected' : '']">{{ tab }}</li>
    </ul>
  </div>
  <div class="review_main__stage">
    <div class="central-content">
      <div>
        <div class="content-tab-content" v-show="currentTab === 'Overview'">
          <ReviewOverview v-bind:componentConfig="componentConfig"/>
        </div>

        <div class="content-tab-content" v-show="currentTab === 'Covering, felt & trim'">
          <ReviewCovering />
        </div>

        <div class="content-tab-content ridge_tab" v-show="isVisibleRidge() && currentTab === 'Ridge & hip'">
          <ReviewRidge />
        </div>

        <div class="content-tab-content decking_tab" v-show="currentTab === 'Decking'">
          <ReviewDecking />
        </div>

        <div class="content-tab-content additional_comp" v-show="currentTab === 'Additional components'">
          <ReviewAdditionalComponents />
        </div>
      </div>
    </div>

    <ButtonsMenu />

    <DescriptionSlider v-bind:component_id="'ReviewView'"/>
  </div>
</template>

<script>
import NotificationText from '@/components/NotificationText'
import ButtonsMenu from '@/components/ButtonsMenu'
import ReviewOverview from '@/components/ReviewOverview'
import ReviewCovering from '@/components/ReviewCovering'
import ReviewRidge from '@/components/ReviewRidge'
import ReviewDecking from '@/components/ReviewDecking'
import ReviewAdditionalComponents from '@/components/ReviewAdditionalComponents'
import { BaseComponent } from '@/mixins/BaseComponent'
import DescriptionSlider from '@/components/DescriptionSlider'

export default {
  mixins: [BaseComponent],
  components: {
    NotificationText, ButtonsMenu, DescriptionSlider, ReviewOverview, ReviewCovering, ReviewRidge, ReviewDecking, ReviewAdditionalComponents
  },
  data () {
    return {
      componentConfig: {},
      currentSectionCode: '',
      currentSection: {},
      currentTab: 'Overview',
      description: 'The most widely used decking materials for a sloped roof are plywood and OSB (oriented strand board). Spaced decking is typically used for cedar shakes roofs to allow for extra ventilation, while purlins are utilized for metal roof coverings with or without felt.'
    }
  },
  computed: {
    getTabs () {
      let tabs = ['Overview', 'Covering, felt & trim', 'Ridge & hip', 'Decking', 'Additional components']
      if (!this.isVisibleRidge()) {
        tabs = tabs.filter(item => item !== 'Ridge & hip')
      }
      return tabs
    }
  },
  beforeMount () {
    this.componentConfig = this.$store.getters.getComponentConfig('ScopeBuild')
    this.initComponentConfig()
  },
  mounted () {
    this.initComponent()
    this.detectSlopeStatus()
    this.$store.dispatch('setCurrentReviewTab', 'Overview')
  },
  methods: {
    selectMainTab (tab) {
      this.currentTab = tab
      this.$store.dispatch('setCurrentReviewTab', tab)
    },
    detectSlopeStatus () {
      this.$store.dispatch('EnableSubmitButton')

      const scope = this.$store.getters.getCurrentScope
      if ((1 * scope.is_rejected) === 0 && (scope.status === 'submitted')) {
        document.querySelector('.bottom-buttons').style.display = 'none'
      } else {
        this.$store.dispatch('setComponentValue', { component: 'ComponentStep', value: 'ReviewView' })
        this.$store.dispatch('setCompleteStep', 'ReviewView')
        this.$store.dispatch('saveConfig')
      }
    },
    isVisibleRidge () {
      if (this.componentConfig.UniqueId === undefined) {
        return true
      }
      return !(this.componentConfig.UniqueId === '2' || this.componentConfig.code === '7')
    },
    initComponentConfig () {
      this.currentSection = this.componentConfig.Sections[0]
      this.currentSectionCode = this.componentConfig.Sections[0].code
    },
    showInfo () {
      const info = document.querySelector('.review')
      info.classList.toggle('active')
    }
  }
}
</script>
