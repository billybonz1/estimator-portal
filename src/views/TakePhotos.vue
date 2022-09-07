<template>
  <NotificationText v-bind:component_id="'TakePhotos'" />

  <div class="central-content photo_page">
    <div class="photo-header">Take risk photos from the ground</div>

    <div class="photo-content">
      <div class="photo-place">
        <PhotoUpload InfoText="Left side of the house" :params="{ component: 'LeftTakePhotos' }" />
      </div>
      <div class="photo-place">
        <PhotoUpload InfoText="Right side of the house" :params="{ component: 'RightTakePhotos' }" />
      </div>
      <div class="photo-place">
        <PhotoUpload InfoText="Back side of the house" :params="{ component: 'BackTakePhotos' }" />
      </div>
      <div class="photo-place">
        <PhotoUpload InfoText="Front side of the house" :params="{ component: 'FrontTakePhotos' }" />
      </div>
    </div>

    <div class="photo-additional-content">
      <PhotoGallery InfoText="Additional photos" :params="{ component: 'TakePhotosAdditional' }" />
    </div>
  </div>

  <ButtonsMenu />

  <DescriptionSlider v-bind:component_id="'Overview'"/>

</template>

<script>
import ButtonsMenu from '@/components/ButtonsMenu'
import PhotoUpload from '@/components/PhotoUpload'
import PhotoGallery from '@/components/PhotoGallery'
import NotificationText from '@/components/NotificationText'
import DescriptionSlider from '@/components/DescriptionSlider'
import { BaseComponent } from '@/mixins/BaseComponent'

export default {
  mixins: [BaseComponent],
  components: {
    ButtonsMenu, PhotoUpload, PhotoGallery, NotificationText, DescriptionSlider
  },
  data () {
    return {
      notification: 'Take photos of the roof from the ground from all four sides of the property. Take additional photos as needed for complex structures or to show additional roofing details.',
      description: 'Valley metal can be exposed, or covered by roofing shingles. When surveying roof valleys, it is important to identify the type used and take relevant measurements and photos.'
    }
  },
  mounted () {
    this.isEnableNextButton()
    this.$store.dispatch('setComponentValue', { component: 'ComponentStep', value: 'TakePhotos' })
    this.initComponent()
  },
  methods: {
    isEnableNextButton () {
      this.$store.dispatch('EnableNextStepButton')
    },
    showInfo () {
      const info = document.querySelector('.take_photo')
      info.classList.toggle('active')
    }
  }
}
</script>
