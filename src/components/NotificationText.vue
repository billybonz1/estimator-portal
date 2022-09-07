<template>
  <div v-if="notification !== ''" class="top-notification">{{ notification }}</div>
</template>

<script>
export default {
  props: {
    component_id: {
      type: Number,
      required: true
    }
  },
  computed: {
    notification () {
      const notes = this.$store.getters.getNotes
      let text = ''
      if (Array.isArray(notes) && notes.length > 0) {
        notes.forEach((note) => {
          if (note.component_name === this.component_id && note.note_type === 'notification') {
            text = note.text
          }
        })
      }
      text = this.decodeHTMLEntities(text)
      return text
    }
  },
  methods: {
    decodeHTMLEntities (text) {
      const textArea = document.createElement('textarea')
      textArea.innerHTML = text
      return textArea.value
    }
  }
}
</script>
