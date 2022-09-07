<template>
  <div class="tr" @click="(e) => openTr(e, claim)">
    <div class="td arr">
      <div class="td_arrow"></div>
    </div>
    <div :class='"td c_id " + getStatusClass(claim)'><div>{{ claim.claim_unique_id }}</div></div>
    <div class="td num">{{ claim.file_number }}</div>
    <div class="td cont">
      <div class="name">{{ getPrimaryContactFullName(claim) }}</div>
      <div class="number">{{ getPhone(claim) }}</div>
    </div>
    <div class="td address" v-html="getAddress(claim)"></div>
    <div :class='"td tol " + getDamageClass(claim)'></div>
    <div class="td adjus">
      <div class="name">{{ claim.public_adjuster_firstname }} {{ claim.public_adjuster_lastname }}</div>
      <div class="number">{{ claim.public_adjuster_cell_phone }}</div>
    </div>
    <div class="td act">
      <a :href='"https://www.google.com/maps/place/" + claim.loss_address1' target="_blank">
        <div class="loc"></div>
      </a>
      <a :href='"mailto:" + getEmail(claim)'>
        <div class="msg"></div>
      </a>
      <a @click.prevent="claimDetail(claim)">
        <div class="step"></div>
      </a>
    </div>

    <ScopeList v-bind:claim="claim" />
  </div>
</template>

<script>
import ScopeList from '@/components/ScopeList'
export default {
  components: {
    ScopeList
  },
  props: {
    claim: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      required: true
    }
  },
  methods: {
    openTr (e, claim) {
      if (e.target.classList.contains('tr')) {
        e.target.classList.toggle('open')
        if (e.target.classList.contains('open') && !claim.hasScopes) {
          this.$store.dispatch('getClaimScopes', { id: claim.id, limit: 1000, page: 0, where: this.buildWhere(claim.id) })
        }
      }
    },
    buildWhere (id) {
      const filters = this.filters
      if (filters.status === 'all') {
        filters.status = ''
      }
      return {
        ...filters,
        claim_id: id
      }
    },
    getPrimaryContactFullName (claim) {
      if (claim.has_contact_person === '1') {
        return claim.contact_person_firstname + ' ' + claim.contact_person_lastname
      } else {
        return claim.customer_firstname + ' ' + claim.customer_lastname
      }
    },
    getPhone (claim) {
      if (claim.has_contact_person === '1') {
        return claim.contact_person_cell_phone
      } else {
        return claim.customer_cell_phone
      }
    },
    getEmail (claim) {
      if (claim.has_contact_person === '1') {
        return claim.contact_person_email
      } else {
        return claim.customer_email
      }
    },
    getDamageClass (claim) {
      return 'icon_' + claim.damage_type.toLowerCase()
    },
    getStatusClass (claim) {
      let status = ''
      if (!claim.has_contact || !claim.scope_count) {
        status = 'opened'
      }
      if (claim.has_contact && claim.scope_count && claim.status === 'in-progress') {
        status = 'in-progress'
        if (claim.has_past_due) {
          status = 'past-due'
        }
      }
      if (claim.has_contact && claim.scope_count && claim.status === 'completed') {
        status = 'completed'
      }
      return status
    },
    getAddress (claim) {
      const address = []
      if (claim.loss_address1 && claim.loss_address1 !== '') {
        address.push(claim.loss_address1)
      }
      if (claim.loss_address2 && claim.loss_address2 !== '') {
        address.push(claim.loss_address2)
      }
      const address1 = []
      if (claim.loss_city && claim.loss_city !== '') {
        address1.push(claim.loss_city)
      }
      if (claim.loss_state_code && claim.loss_state_code !== '' && claim.loss_zip && claim.loss_zip !== '') {
        address1.push(claim.loss_state_code + ' ' + claim.loss_zip)
      }
      return '<p>' + address.join(', ') + '</p><p>' + address1.join(', ') + '</p>'
    },
    claimDetail (claim) {
      this.$store.dispatch('setCurrentClaim', claim.id)

      if (!claim.hasScopes) {
        this.$store.dispatch('getClaimScopes', { id: claim.id, limit: 1000, page: 0, where: this.buildWhere(claim.id) })
          .then(() => {
            this.$router.push('/claim_details')
          })
      } else {
        this.$router.push('/claim_details')
      }
    }
  }
}
</script>

<style>
  .claim_table .td.address {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
</style>
