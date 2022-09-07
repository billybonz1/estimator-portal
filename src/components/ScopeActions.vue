<template>
  <a v-if="scope.is_rejected === '1'">
    <div class="rejected-icon" @click.prevent="popup = 1" title="Rejected message"></div>
  </a>
  <a v-if="scope.status === 'submitted' && scope.scope_type === 'roofing'">
    <div class="review" @click.prevent="ReviewScope(scope.id)" title="Review"></div>
  </a>
  <a v-else>
    <div v-if="scope.scope_type === 'roofing'"
      class="step" @click.prevent="StartBuild(scope.id)" title="Perform"></div>
  </a>

  <div v-if="scope.is_rejected === '1'" class="rejected-popup popup" :class="{opened: this.popup === 1}">
    <div>
      <h3>Reject information</h3>
      <div>
        <h4>Notes</h4>
        <div>{{ scope.rejected_note }}</div>
      </div>
      <div class="close" @click="popup = 0">Close</div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    popup: 0
  }),
  props: {
    scope: {
      type: Object,
      required: true
    }
  },
  methods: {
    StartBuild (id) {
      this.$store.dispatch('setCurrentScope', id)
      const CurrentScope = this.$store.getters.getCurrentScope

      if (CurrentScope) {
        // update status
        this.$store.dispatch('setScopeStatus', { id: id, status: 'in-progress' })

        // route to
        this.$store.dispatch('resetMenu')
        const ComponentStep = CurrentScope.config.ComponentStep || this.$store.getters.getFirstStepComponent
        this.$store.dispatch('SetupStep', ComponentStep)
        this.$router.push('/' + ComponentStep)
      }
    },
    ReviewScope (id) {
      this.$store.dispatch('setCurrentScope', id)
      const CurrentScope = this.$store.getters.getCurrentScope

      if (CurrentScope) {
        // route to
        this.$store.dispatch('resetMenu')
        this.$router.push('/' + this.$store.getters.getLastStepComponent)
      }
    }
  }
}
</script>
