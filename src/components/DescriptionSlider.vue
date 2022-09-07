<template>
  <div v-if="description.length > 0" class="bottom-description scoup_build">
    <div class="click_line" @click="showInfo">
      <i class="arrow"></i>
    </div>
    <carousel :items-to-show="1">
      <template #addons>
        <pagination />
      </template>
      <slide v-for="slide in description" :key="slide">
        <div class="desck_text">{{ slide.text }}</div>
        <div class="desck_img" v-if="slide.img !== ''">
          <img :src="slide.img" alt="">
        </div>
      </slide>
    </carousel>
  </div>
</template>

<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination } from 'vue3-carousel'
export default {
  components: {
    Carousel, Slide, Pagination
  },
  props: {
    component_id: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    description: []
  }),
  mounted () {
    const notes = this.$store.getters.getNotes
    if (Array.isArray(notes) && notes) {
      notes.forEach((note) => {
        if (
          ((!note.scope_id) || (note.scope_id === this.$store.getters.getCurrentScope.id)) && note.component_name === this.component_id && note.note_type === 'description'
        ) {
          this.description.push({
            text: this.decodeHTMLEntities(note.text),
            img: note.image && note.image !== '' ? this.imageUrl(note.image) : ''
          })
        }
      })
    }
  },
  methods: {
    showInfo () {
      document.querySelector('.scoup_build').classList.toggle('active')
    },
    imageUrl (img) {
      return this.$store.getters.getApiUrl.replace('/das-json.php', img)
    },
    decodeHTMLEntities (text) {
      const textArea = document.createElement('textarea')
      textArea.innerHTML = text
      return textArea.value
    }
  }
}
</script>
