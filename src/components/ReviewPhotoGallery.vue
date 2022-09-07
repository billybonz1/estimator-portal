<template>
  <div class="photo-gallery-place" v-for="item in images" :key="item.id">
    <div class="imagePreview" @click="showGallery(item.url)" :style="{ 'background-image': `url(${item.preview_url ? item.preview_url : item.url})` }" v-show="item.url !== ''"></div>
  </div>
</template>

<script>
export default {
  props: {
    params: { type: Object, required: true }
  },
  data () {
    return {
      images: []
    }
  },
  watch: {
    params (newParams, oldParams) {
      this.images = []
      this.loadScopePhotos()
    }
  },
  beforeMount () {
    this.loadScopePhotos()
  },
  methods: {
    showGallery (image) {
      this.$store.dispatch('setTakePhotoGallery', image)
    },
    loadScopePhotos () {
      if (Array.isArray(this.$store.getters.getCurrentScope.photos)) {
        const Photos = this.$store.getters.getCurrentScope.photos.filter(photo => {
          if (this.params.sections !== undefined && Array.isArray(this.params.sections)) {
            return this.params.components.includes(photo.component) && this.params.sections.includes(photo.section)
          }
          if (this.params.components !== undefined && Array.isArray(this.params.components)) {
            return this.params.components.includes(photo.component)
          }
          return false
        })

        if (Array.isArray(Photos) && Photos.length > 0) {
          Photos.forEach((Photo) => {
            if (Photo !== undefined && Photo.url !== undefined) {
              const exist = this.images.find(item => item.id === Photo.id)
              if (exist === undefined) {
                const obj = { url: Photo.url, id: 1 * Photo.id }
                if (Photo.preview_url !== undefined) {
                  obj.preview_url = Photo.preview_url
                }
                this.images.push(obj)
              }
            }
          })
        }
      }
    }
  }
}
</script>
