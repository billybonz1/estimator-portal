<template>
  <div class="imagePreviewWrapper" @click="selectImage"
       :style="{ 'background-image': `url(${Photo.preview_url ? Photo.preview_url : Photo.previewImage})` }"
       v-show="Photo.previewImage !== ''">
  </div>

  <div v-show="Photo.previewImage !== '' && !(uploadPercentage > 0 && uploadPercentage < 100)"
       class="delete-image" title="Remove" @click="deleteImage"></div>

  <div class="photo-icon" @click="selectImage" v-show="Photo.previewImage === ''">
    <div class="photo-icon-text">{{ InfoText }}</div>
    <input ref="fileInput" type="file" @input="pickFile" v-on:change="handleFileUpload()" accept="image/*" style="display: none">
  </div>

  <div class="progress-actions" v-show="uploadPercentage > 0">
    <div class="progress" v-show="(uploadPercentage > 0 && uploadPercentage < 100)">
      <svg class="progress-circle" width="80px" height="80px" xmlns="http://www.w3.org/2000/svg">
        <circle class="progress-circle-back" cx="40" cy="40" r="35"></circle>
        <circle class="progress-circle-prog" cx="40" cy="40" r="35"
                :style="{ 'strokeDasharray': `${strokeDash}` }"></circle>
      </svg>
      <div class="progress-text">{{ uploadPercentage }}%</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    InfoText: { type: String, required: true, default: 'Left side of the house' },
    params: { type: Object, required: true }
  },
  data () {
    return {
      method: 'api.ScopeIntegration::uploadScopePhoto',
      uploadPercentage: 0,
      strokeDash: 0,
      Photo: {
        previewImage: '',
        id: 0
      }
    }
  },
  beforeMount () {
    this.loadScopePhotos()
  },
  methods: {
    loadScopePhotos () {
      if (Array.isArray(this.$store.getters.getCurrentScope.photos)) {
        const Photo = this.$store.getters.getCurrentScope.photos.find(photo => {
          return photo.component === this.params.component
        })
        if (Photo !== undefined && Photo.url !== undefined) {
          this.Photo.previewImage = Photo.url
          this.Photo.id = 1 * Photo.id
          if (Photo.preview_url !== undefined) {
            this.Photo.preview_url = Photo.preview_url
          }
        }
      }
    },
    deleteImage () {
      const post = {
        model: 'api.ScopeIntegration',
        method: 'deleteScopePhoto',
        params: {
          scopeId: this.$store.getters.getCurrentScope.id,
          photoId: this.Photo.id
        }
      }

      this.$store.dispatch('ApiCall', post).then((response) => {
        this.$store.dispatch('deleteScopePhoto', this.Photo.id)
        this.Photo.previewImage = ''
        this.Photo.id = 0
        this.loadScopePhotos()
      })
    },
    selectImage () {
      if (this.Photo.previewImage === '') {
        this.$refs.fileInput.click()
      } else {
        this.$store.dispatch('setTakePhotoGallery', this.Photo.previewImage)
      }
    },
    pickFile () {
      const input = this.$refs.fileInput
      const file = input.files
      if (file && file[0]) {
        const reader = new FileReader()
        reader.onload = e => {
          // this.Photo.previewImage = e.target.result
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
      }
    },
    handleFileUpload () {
      const formData = new FormData()
      formData.append('file', this.$refs.fileInput.files[0])
      formData.append('jsonrpc', '2.0')
      formData.append('method', this.method)
      formData.append('params[scopeId]', this.$store.getters.getCurrentScope.id)
      for (const [key, value] of Object.entries(this.params)) {
        formData.append('params[' + key + ']', value)
      }
      const self = this

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
      ).then((response) => {
        if (response.data !== undefined && response.data.result !== undefined) {
          this.Photo.previewImage = response.data.result.url
          self.$store.dispatch('addScopePhoto', response.data.result)
          self.Photo.id = response.data.result.id
        }
      }).catch(error => {
        console.error('axios error!', error)
      })
    }
  }
}
</script>
