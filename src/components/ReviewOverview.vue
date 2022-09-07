<template>
  <h1>Overview</h1>
  <div class="overview_info" style="justify-content: flex-start">
    <ul class="overview_list">
      <li>
        <div>Roof type:</div><div>{{ componentConfig.Title }}</div>
      </li>
      <li>
        <div>Total area, sq ft:</div><div>{{ componentConfig.Overview.TotalArea }}</div>
      </li>
      <li>
        <div>Total slopes:</div><div>{{ componentConfig.Overview.SlopesCount }}</div>
      </li>
      <li v-show="componentConfig.Overview.PredominantPitch !== ''">
        <div>Predominant pitch:</div><div>{{ componentConfig.Overview.PredominantPitch }}</div>
      </li>
      <li>
        <div># of ridges / total length:</div>
        <div>{{ componentConfig.Overview.LinesInfo.ridge.count }} / {{ componentConfig.Overview.LinesInfo.ridge.total }}</div>
      </li>
      <li>
        <div># of hips / total length:</div>
        <div>{{ componentConfig.Overview.LinesInfo.hip.count }} / {{ componentConfig.Overview.LinesInfo.hip.total }}</div>
      </li>
      <li>
        <div># of valleys / total length:</div>
        <div>{{ componentConfig.Overview.LinesInfo.valley.count }} / {{ componentConfig.Overview.LinesInfo.valley.total }}</div>
      </li>
      <li>
        <div># of rakes / total length:</div>
        <div>{{ componentConfig.Overview.LinesInfo.rake.count }} / {{ componentConfig.Overview.LinesInfo.rake.total }}</div>
      </li>
      <li>
        <div># of eaves / total length:</div>
        <div>{{ componentConfig.Overview.LinesInfo.eave.count }} / {{ componentConfig.Overview.LinesInfo.eave.total }}</div>
      </li>
      <li>
        <div>Photos:</div><div>{{ OverviewPhotosCount }}</div>
      </li>
    </ul>

    <div v-show="OverviewPhoto !== ''" style="width: 700px; overflow: auto; margin-left: 20px">
      <img width="680" :src="OverviewPhoto">
    </div>
  </div>
  <div class="photo-additional-content">
    <ReviewPhotoGallery :params="{ components: PhotoComponents }"/>
  </div>
</template>

<script>
import ReviewPhotoGallery from '@/components/ReviewPhotoGallery'

export default {
  props: {
    componentConfig: {
      type: Object,
      required: true
    }
  },
  components: {
    ReviewPhotoGallery
  },
  data () {
    return {
      OverviewPhoto: '',
      PhotoComponents: ['TakePhotosAdditional', 'LeftTakePhotos', 'RightTakePhotos', 'BackTakePhotos', 'FrontTakePhotos']
    }
  },
  computed: {
    OverviewPhotosCount () {
      let OverviewPhotosCount = 0
      if (Array.isArray(this.$store.getters.getCurrentScope.photos)) {
        const Photos = this.$store.getters.getCurrentScope.photos.filter(photo => {
          return this.PhotoComponents.includes(photo.component)
        })
        OverviewPhotosCount = Photos.length
      }
      return OverviewPhotosCount
    }
  },
  mounted () {
    if (Array.isArray(this.$store.getters.getCurrentScope.photos)) {
      const Photo = this.$store.getters.getCurrentScope.photos.find(photo => {
        return photo.component === 'DrawSketchPreview'
      })

      if (Photo !== undefined && Photo.url !== undefined) {
        this.OverviewPhoto = Photo.url
      } else {
        this.OverviewPhoto = ''
      }
    }
  }
}
</script>
