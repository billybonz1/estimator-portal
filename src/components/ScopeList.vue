<template>
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
      <symbol id="checkmark" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-miterlimit="10" fill="none" d="M22.9 3.7l-15.2 16.6-6.6-7.1">
          </path>
      </symbol>
  </svg>
  <div v-if="claim.hasScopes" class="inner_table__wrapp">
    <div class="btns_wrapp">
      <button v-if="this.getCurrentUser.skills.indexOf('1') > -1 || this.getCurrentUser.skills.indexOf('2') > -1" class="small-btn with-icon migration" @click.prevent="openPopup('mitigation')">Add  mitigation</button>
      <button v-if="this.getCurrentUser.skills.indexOf('3') > -1" class="small-btn with-icon construction" @click.prevent="openPopup('construction')">Add  construction</button>
    </div>
    <div class="table_division claim_table inner with_scroll" v-if="claim.scopesList.length > 0">
      <div class="thead">
        <div class="tr">
          <div class="th s_id">Scope ID<i class="th_arrow"></i></div>
          <div class="th st">Service type</div>
          <div class="th_group">
            <div class="th group_name">Milestones</div>
            <div class="th schedule">Scheduled</div>
            <div class="th perf">Performed</div>
            <div class="th rv">Return visit</div>
            <div class="th sub">Submitted</div>
            <div class="th dd">Due date</div>
            <div class="th appr">Approved</div>
          </div>
          <div class="th act">Actions</div>
        </div>
      </div>
      <div class="tbody">
        <div :data-id="scope.id" class="tr" :class="{rejected: scope.is_rejected === '1'}" v-for="scope in claim.scopesList" :key="scope.id">
          <div :class='"td s_id " + getScopeStatusClass(scope)'><div>{{ scope.scope_id_formatted }}</div></div>
          <div class="td st">{{ scope.scope_type.replace('_',' ') }}</div>
          <div class="td schedule">{{ formatDate(scope.scheduled_datetime) }}</div>
          <div class="td perf">{{ formatDate(scope.visit_datetime) }}</div>
          <div class="td rv">{{ formatDate(scope.return_visit_datetime) }}</div>
          <div class="td sub">{{ formatDate(scope.submission_datetime) }}</div>
          <div class="td dd">{{ formatDate(scope.expected_submission_date) }}</div>
          <div class="td appr">{{ formatDate(scope.completed_on) }}</div>
          <div class="td act">
            <ScopeActions v-bind:scope="scope" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScopeActions from '@/components/ScopeActions'
import moment from 'moment'
export default {
  components: {
    ScopeActions
  },
  props: {
    claim: {
      type: Object,
      required: true
    }
  },
  computed: {
    getCurrentUser () {
      const user = this.$store.getters.getCurrentUser
      if (!Array.isArray(user.skills)) {
        user.skills = []
      }
      return user
    }
  },
  data: () => ({
    popup: {
      opened: '',
      data: {
        user_id: 0,
        scheduled_date: '',
        due_date: '',
        notes: '',
        types: {
          interior: false,
          contents: false,
          roofing: false,
          interior_structure: false,
          elevations: false,
          other_structures: false
        }
      }
    }
  }),
  methods: {
    getScopeStatusClass (scope) {
      let status = scope.status
      if (scope.status !== 'completed' && scope.is_pastdue) {
        status = 'past-due'
      }
      return status
    },
    formatDate (date) {
      if (date && date !== '0000-00-00 00:00:00') {
        return moment(String(date)).format('MM/DD/YYYY')
      }
    },
    openPopup (name) {
      const popup = {
        opened: name,
        data: {
          user_id: this.getCurrentUser.id,
          damage_type_id: this.claim.damage_type_id,
          claim_id: this.claim.id,
          scheduled_date: '',
          due_date: '',
          notes: '',
          types: {
            interior: false,
            contents: false,
            roofing: false,
            interior_structure: false,
            elevations: false,
            other_structures: false
          }
        }
      }
      this.$store.dispatch('setActivePopup', { popup: popup })
    }
  }
}
</script>

<style>
  .rejected .td{
    background: rgba(239, 70, 111, 0.15) !important;
  }
  .claim_table .st{
    text-transform: capitalize;
  }
</style>
