<template>
  <div class="photo-gallery-place">
    <div class="photo-icon" @click="selectImage" v-show="uploadPercentage === 0 || uploadPercentage === 100">
      <div class="photo-icon-text">{{ InfoText }}</div>
      <input ref="fileInput" type="file" @input="pickFile" v-on:change="handleFileUpload()" accept="image/*" style="display: none">
    </div>

    <div class="progress-actions" v-show="(uploadPercentage > 0 && uploadPercentage < 100)">
      <div class="progress">
        <svg class="progress-circle" width="80px" height="80px" xmlns="http://www.w3.org/2000/svg">
          <circle class="progress-circle-back" cx="40" cy="40" r="35"></circle>
          <circle class="progress-circle-prog" cx="40" cy="40" r="35"
                  :style="{ 'strokeDasharray': `${strokeDash}` }"></circle>
        </svg>
        <div class="progress-text">{{ uploadPercentage }}%</div>
      </div>
    </div>
  </div>

  <div class="photo-gallery-place" v-for="item in images" :key="item.id">
    <div class="imagePreview" @click="showGallery(item.url)" :style="{ 'background-image': `url(${item.preview_url ? item.preview_url : item.url})` }" v-show="item.url !== ''"></div>
    <button v-show="item.url !== ''" class="delete-image" title="Remove"
            @click="deleteImage(item.id)"></button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    InfoText: { type: String, required: true, default: 'Additional photos' },
    params: { type: Object, required: true }
  },
  data () {
    return {
      method: 'api.ScopeIntegration::uploadScopePhoto',
      uploadPercentage: 0,
      strokeDash: 0,
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
          if (this.params.section !== undefined) {
            return photo.component === this.params.component && photo.section === this.params.section
          }
          return photo.component === this.params.component
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
    },
    deleteImage (id) {
      const conf = confirm('Photo will be permanently deleted. Do you want to proceed?')
      if (conf) {
        const post = {
          model: 'api.ScopeIntegration',
          method: 'deleteScopePhoto',
          params: {
            scopeId: this.$store.getters.getCurrentScope.id,
            photoId: id
          }
        }

        this.$store.dispatch('ApiCall', post).then((response) => {
          this.$store.dispatch('deleteScopePhoto', id)
          this.images = this.images.filter(
            item => item.id !== id
          )
        })
      }
    },
    selectImage () {
      this.$refs.fileInput.click()
    },
    pickFile () {
      const input = this.$refs.fileInput
      const file = input.files
      if (file && file[0]) {
        this.$emit('input', file[0])
      }
    },
    handleFileUpload () {
      const self = this
      const formData = new FormData()
      formData.append('file', this.$refs.fileInput.files[0])
      formData.append('jsonrpc', '2.0')
      formData.append('method', this.method)
      formData.append('params[scopeId]', this.$store.getters.getCurrentScope.id)
      for (const [key, value] of Object.entries(this.params)) {
        formData.append('params[' + key + ']', value)
      }

      axios.post(
        this.$store.getters.getApiUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: function (progressEvent) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100))
            this.strokeDash = this.uploadPercentage * (4.64) + ' 999'
          }.bind(this)
        }
      ).then(function (response) {
        if (response.data !== undefined && response.data.result !== undefined) {
          self.$store.dispatch('addScopePhoto', response.data.result)
          self.loadScopePhotos()
        }
      }).catch(error => {
        console.error('axios error!', error)
      })
    }
  }
}
</script>
