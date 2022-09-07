<template>
  <div class="scope_page">
    <ul class="nav-menu">
      <li><a href="/login" @click.prevent="Logout">Logout</a></li>
    </ul>

    <ScopePopups />

    <div class="scope_head__line">
      <div class="scope__user">{{ getCurrentUser.firstname }} {{ getCurrentUser.lastname }}</div>
      <div class="scope_burger__menu" @click="showMenu"><span></span></div>
    </div>

    <div class="scope_container claims">
      <div class="search_box">
        <div class="field s2_max_width__350">
          <div class="lebel">Status</div>
          <div>
            <Select2 v-model="filters.status" :options="[{ id: 0, text: 'All' }, { id: 'opened', text: 'Opened' }, { id: 'in-progress', text: 'In Progress' }, { id: 'past-due', text: 'Past Due' }, { id: 'completed', text: 'Completed' }, { id: 'submitted', text: 'Submitted' }]" :settings="{ width: '320px', minimumResultsForSearch: -1 }" />
          </div>
        </div>
        <div class="field">
          <div class="lebel">primary contact</div>
          <div>
            <input type="text" v-model="filters.contact_person" style="max-width:350px; min-width: 150px;">
          </div>
        </div>
        <div class="field">
          <div class="lebel">Scheduled date</div>
          <div class="date_field">
            <input type="date" v-model="filters.scheduled_datetime" autocomplete="on" style="width:165px">
          </div>
        </div>
        <div class="field">
          <div class="lebel">due date</div>
          <div class="date_field">
            <input type="date" v-model="filters.expected_submission_date" style="width:165px">
          </div>
        </div>

        <div class="c_btns__wr">
          <button class="big-btn reset" @click="reset()">Reset</button>
          <button class="big-btn with-icon" @click="filter()">Search</button>
        </div>
      </div>

      <div class="table_division table_dropdown claim_table">
        <div class="thead">
          <div class="tr">
            <div class="th arr"></div>
            <div class="th c_id">Claim ID<i class="th_arrow"></i></div>
            <div class="th num">File number</div>
            <div class="th cont">Primary contact</div>
            <div class="th address">Loss address</div>
            <div class="th tol">Type of loss</div>
            <div class="th adjus">Adjuster</div>
            <div class="th act">Actions</div>
          </div>
        </div>
        <div class="tbody">
            <ClaimItem v-for="claim in getClaims" v-bind:claim="claim" v-bind:filters="buildWhere()" :key="claim.id"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClaimItem from '@/components/ClaimItem'
import Select2 from 'vue3-select2-component'
import moment from 'moment'
import '@vuepic/vue-datepicker/dist/main.css'
import ScopePopups from '@/components/ScopePopups'

import { mapGetters } from 'vuex'

export default {
  components: {
    ClaimItem,
    Select2,
    ScopePopups
  },
  computed:
    {
      ...mapGetters(['getClaims']),
      getCurrentUser () {
        return this.$store.getters.getCurrentUser
      }
    },
  data: () => ({
    Claim: {},
    RequestClaimsCountLimit: 10,
    filters: {
      estimator_id: 0,
      contact_person: '',
      status: 0,
      scheduled_datetime: '',
      expected_submission_date: ''
    },
    filters_search: {
      estimator_id: 0,
      contact_person: '',
      status: 0,
      scheduled_datetime: '',
      expected_submission_date: ''
    }
  }),
  beforeMount () {

  },
  mounted () {
    this.filters_search.estimator_id = this.getCurrentUser.id

    this.$store.dispatch('createClaimsList', {
      limit: this.RequestClaimsCountLimit, page: 0, where: this.buildWhere()
    })
    this.getNextClaims()
  },
  methods: {
    showMenu () {
      const burger = document.querySelector('.scope_burger__menu')
      const menu = document.querySelector('.nav-menu')

      menu.classList.toggle('open')
      burger.classList.toggle('clicked')
    },
    getNextClaims () {
      window.onscroll = () => {
        if (this.$router.currentRoute._value.name === 'scopes' || this.$router.currentRoute._value.name === 'home') {
          const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight + 50 > document.documentElement.offsetHeight
          if (bottomOfWindow && this.$store.getters.getCanFetch) {
            this.$store.dispatch('changeCanFetch', 0)
            const page = Math.round(this.$store.getters.getClaims.length / this.RequestClaimsCountLimit)
            this.$store.dispatch('fetchClaims', { limit: this.RequestClaimsCountLimit, page: page, where: this.buildWhere() }).then(() => {
              console.log(page)
            })
          }
        }
      }
    },
    buildWhere () {
      return this.filters_search
    },
    filter () {
      this.filters.estimator_id = this.getCurrentUser.id
      const filters = this.filters
      if (filters.scheduled_datetime !== '') {
        filters.scheduled_datetime = moment(this.filters.scheduled_datetime).format('YYYY-MM-DD')
      }
      if (filters.expected_submission_date !== '') {
        filters.expected_submission_date = moment(this.filters.expected_submission_date).format('YYYY-MM-DD')
      }
      if (filters.status === 'all') {
        filters.status = ''
      }
      this.filters_search = filters
      this.$store.dispatch('createClaimsList', {
        limit: this.RequestClaimsCountLimit, page: 0, where: this.buildWhere()
      }).then(() => {
        document.querySelectorAll('.open').forEach((el) => {
          el.classList.remove('open')
        })
      })
    },
    reset () {
      this.filters = {
        estimator_id: this.getCurrentUser.id,
        contact_person: '',
        status: 'all',
        scheduled_datetime: '',
        expected_submission_date: ''
      }
      this.filter()
    },
    async Logout () {
      try {
        await this.$store.dispatch('logout')

        this.$router.push('/login')
      } catch (e) {
        this.$notify(e)
      }
    }
  }
}
</script>
