<template>
  <ul class="nav-menu">
    <li><router-link to="/scopes">Jobs</router-link></li>
    <li><a href="/login" @click.prevent="Logout">Logout</a></li>
  </ul>

  <div class="main">
    <LeftStepMenu />
    <ScopePopups />

    <div class="right-side">
      <TopMenu />

      <div class="component-content">
        <router-view />

        <vue-easy-lightbox
          :visible="$store.getters.getGalleryParams.visible"
          :imgs="$store.getters.getGalleryParams.photos"
          :index="$store.getters.getGalleryParams.index"
          @hide="$store.dispatch('closeGallery')"
        ></vue-easy-lightbox>
      </div>
    </div>
  </div>
</template>
<script>
import LeftStepMenu from '@/components/LeftStepMenu'
import TopMenu from '@/components/TopMenu'
import ScopePopups from '@/components/ScopePopups'
import VueEasyLightbox from 'vue-easy-lightbox'

export default {
  components: {
    LeftStepMenu, TopMenu, ScopePopups, VueEasyLightbox
  },
  methods: {
    async Logout () {
      try {
        await this.$store.dispatch('logout')

        this.$router.push('/login')
      } catch (e) {
        this.$notify(e)
      }
    }
  },
  mounted () {
    this.Scope = this.$store.getters.getCurrentScope
  }
}
</script>
