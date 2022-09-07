export default {
  state: {
    gallery: {
      index: 0,
      visible: false,
      photo: [],
      currentTab: '',
      currentReviewTab: '',
      currentReviewTab2: '',
      section: ''
    }
  },
  getters: {
    getGalleryParams (state) {
      return state.gallery
    }
  },
  mutations: {
    setGalleryIndex (state, index) {
      state.gallery.index = index
      state.gallery.visible = true
    },
    closeGallery (state) {
      state.gallery.visible = false
    },
    setGalleryPhotos (state, photos) {
      state.gallery.photos = photos
    },
    setCurrentTab (state, tab) {
      state.gallery.currentTab = tab
    },
    setCurrentReviewTab (state, tab) {
      state.gallery.currentReviewTab = tab
    },
    setCurrentReviewTab2 (state, tab) {
      state.gallery.currentReviewTab2 = tab
    },
    setSection (state, section) {
      state.gallery.section = section
    }
  },
  actions: {
    setGalleryIndex (context, index) {
      context.commit('setGalleryIndex', index)
    },
    closeGallery (context) {
      context.commit('closeGallery')
    },
    setGalleryPhotos (context, photos) {
      context.commit('setGalleryPhotos', photos)
    },
    setTakePhotoGallery (context, image) {
      console.log(image)
      const galleryImages = []
      this.getters.getCurrentScope.photos.forEach((photo) => {
        if (photo.component !== null) {
          const indexOf = photo.component.indexOf(location.pathname.replace('/', '').match(/[A-Z][a-z]+/g)[0])
          const globalComponent = location.pathname.replace('/', '')
          if ((globalComponent === 'TakePhotos' && indexOf !== -1) || ((globalComponent === 'AdditionalComponents' && this.getters.getGalleryParams.currentTab === photo.section) || ((globalComponent !== 'TakePhotos' && globalComponent !== 'AdditionalComponents') && indexOf === 0 && photo.section === this.getters.getGalleryParams.section)) || (globalComponent === 'ReviewView' && this.getters.getGalleryParams.currentReviewTab === 'Overview' && photo.component.indexOf('Take') > -1) || (globalComponent === 'ReviewView' && this.getters.getGalleryParams.currentReviewTab === 'Covering, underlayment & trim' && (photo.component.indexOf('Under') > -1 || photo.component.indexOf('Slopes') > -1)) || (globalComponent === 'ReviewView' && this.getters.getGalleryParams.currentReviewTab === 'Decking' && photo.component.indexOf('Decking') > -1) || (globalComponent === 'ReviewView' && this.getters.getGalleryParams.currentReviewTab === 'Ridge & hip' && photo.component.indexOf('Ridge') > -1) || (globalComponent === 'ReviewView' && this.getters.getGalleryParams.currentReviewTab === 'Additional components' && this.getters.getGalleryParams.currentReviewTab2 === 'flashing' && photo.component.indexOf('Additional') > -1 && photo.section === 'flashing') || (globalComponent === 'ReviewView' && this.getters.getGalleryParams.currentReviewTab === 'Additional components' && this.getters.getGalleryParams.currentReviewTab2 === 'ventilation' && photo.component.indexOf('Additional') > -1 && photo.section === 'ventilation') || (globalComponent === 'ReviewView' && this.getters.getGalleryParams.currentReviewTab === 'Additional components' && this.getters.getGalleryParams.currentReviewTab2 === 'drainage' && photo.component.indexOf('Additional') > -1 && photo.section === 'drainage') || (globalComponent === 'ReviewView' && this.getters.getGalleryParams.currentReviewTab === 'Additional components' && this.getters.getGalleryParams.currentReviewTab2 === 'other' && photo.component.indexOf('Additional') > -1 && photo.section === 'other')) {
            galleryImages.push(photo.url)
          }
        }
      })
      this.dispatch('setGalleryPhotos', galleryImages)
      const index = this.getters.getGalleryParams.photos.indexOf(image)
      console.log(index)
      this.dispatch('setGalleryIndex', index)
    },
    setCurrentTab (context, tab) {
      context.commit('setCurrentTab', tab)
    },
    setCurrentReviewTab (context, tab) {
      context.commit('setCurrentReviewTab', tab)
    },
    setCurrentReviewTab2 (context, tab) {
      context.commit('setCurrentReviewTab2', tab)
    },
    setSection (context, section) {
      context.commit('setSection', section)
    }
  }
}
