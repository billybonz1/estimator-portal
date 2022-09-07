<template>
  <div class="bottom-buttons">
    <button class="button" @click="BackStep">Back</button>
    <button id="next-button" class="button next" @click="NextStep">Next</button>
    <button id="submit-button" class="button submit" @click="Submit">Save and Submit</button>
  </div>
</template>

<script>
import router from '@/router'

export default {
  methods: {
    NextStep () {
      if (document.querySelector('#next-button').classList.contains('active')) {
        this.$store.dispatch('setCompleteStep', this.$route.name)
        this.$store.dispatch('NextStep')
        this.$store.dispatch('saveConfig')
      }
    },
    BackStep () {
      this.$store.dispatch('BackStep')
    },
    async Submit () {
      if (document.querySelector('#submit-button').classList.contains('active')) {
        this.$store.dispatch('saveConfig')

        // set status 'submitted'
        const CurrentScope = this.$store.getters.getCurrentScope
        if (CurrentScope.id !== undefined) {
          await this.$store.dispatch('setScopeStatus', { id: CurrentScope.id, status: 'submitted' })
          await router.push('/')
        }
      }
    }
  }
}
</script>
