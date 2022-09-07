<template>
  <NotificationText v-bind:component_id="'DrawSketch'" />

  <RoofDrawingTool />

  <div class="bottom-buttons">
    <button class="button" @click="BackStep">Back</button>
    <button id="next-button" class="button next" @click="NextStep">Next</button>
  </div>

  <DescriptionSlider v-bind:component_id="'Overview'"/>
</template>

<script>
import RoofDrawingTool from '@/components/RoofDrawingTool'
import NotificationText from '@/components/NotificationText'
import DescriptionSlider from '@/components/DescriptionSlider'
import { BaseComponent } from '@/mixins/BaseComponent'

export default {
  mixins: [BaseComponent],
  components: {
    RoofDrawingTool, NotificationText, DescriptionSlider
  },
  data () {
    return {
      notification: 'Sketch the shape of the roof as a top-down view. You can use multiple roof type elements to create a Combination roof sketch.',
      description: 'Gable is the most widely used roof type for residential buildings. While usually symmetrical, in some cases the slopes of the gable roof may be different. When scoping gable roofs independently measure pitch and dimensions of each slope.'
    }
  },
  beforeMount () {

  },
  mounted () {
    this.$store.dispatch('setComponentValue', { component: 'ComponentStep', value: 'DrawSketch' })
    this.initComponent()
  },
  methods: {
    isEnableNextButton () {
      this.$store.dispatch('EnableNextStepButton')
    },
    showInfo () {
      const info = document.querySelector('.sketch')
      info.classList.toggle('active')
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
