<template>
  <div class="left-side">
    <div class="nav_menu__trigger" @click="showMenu">
      <span></span>
    </div>
    <div class="user-menu"></div>
    <div class="progress-menu">
      <div class="step" v-for="(item, index) in menu" :key="item.step" @click="RouteToPage(item)"
           v-bind:class="{active: item.is_active, done: item.is_active_route}" >
        <span class="step_number">{{ index + 1 }}</span>
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'

export default {
  computed: {
    menu () {
      let isNavigationMenuAvailable = true
      const scope = this.$store.getters.getCurrentScope
      if ((1 * scope.is_rejected) === 0 && (scope.status === 'submitted')) {
        isNavigationMenuAvailable = false
      }

      // Flat roof
      let isVisible = true
      const ScopeBuild = this.$store.getters.getComponentConfig('ScopeBuild')
      if (ScopeBuild !== undefined) {
        isVisible = !(ScopeBuild.UniqueId === '2' || ScopeBuild.UniqueId === '7')
      }

      const list = []
      this.$store.getters.getLeftMenu.forEach((item) => {
        if (item.view === 'RidgeHip') {
          item.is_visible = isVisible
        }

        if (item.is_visible === undefined || item.is_visible) {
          if (isNavigationMenuAvailable) {
            item.is_active_route = this.$store.getters.isCompleteComponent(item.view)
          }

          list.push(item)
        }
      })
      return list
    }
  },
  methods: {
    showMenu () {
      const burger = document.querySelector('.nav_menu__trigger')
      const menu = document.querySelector('.nav-menu')

      menu.classList.toggle('open')
      burger.classList.toggle('clicked')
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
