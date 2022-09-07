<template>
  <div class="top-menu">
    <div class="sub-step-menu">
      <div class="sub-step"
           v-for="item in menu" :key="item.step" @click="RouteToPage(item)"
           v-bind:class="{active: item.is_active, done: item.done}"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="top-menu-buttons">
      <button class="save-button" @click="saveProgress">Save</button>
    </div>
  </div>
</template>
<script>
import router from '@/router'

export default {
  computed: {
    menu () {
      const list = []
      this.$store.getters.getTopMenu.forEach((item) => {
        if (item.is_visible === undefined || item.is_visible) {
          item.is_active_route = this.$store.getters.isCompleteComponent(item.view)
          list.push(item)
        }
      })
      return list
    }
  },
  methods: {
    saveProgress () {
      this.$store.dispatch('saveConfig')
    },
    RouteToPage (item) {
      if (item.is_active_route && item.view !== undefined) {
        this.$store.dispatch('SetupStep', item.view)
        router.push('/' + item.view)
      }
    }
  }
}
</script>
