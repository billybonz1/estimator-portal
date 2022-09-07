<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<style lang="css">
  @import "css/main.css";
</style>

<script>
import EmptyLayout from './layouts/EmptyLayout'
import MainLayout from './layouts/MainLayout'
import { mapActions } from 'vuex'

export default {
  computed: {
    layout () {
      this.$store.dispatch('setupCurrentScope')
      return (this.$route.meta.layout || 'empty') + '-layout'
    }
  },
  components: {
    MainLayout, EmptyLayout
  },
  methods: mapActions(['fetchRoofsDictionary', 'fetchScopes']),
  async mounted () {
    // this.fetchRoofsDictionary()
    if (!this.$store.getters.getNotes) {
      this.$store.dispatch('createNotesList')
    }
  }
}
</script>
