<template>
  <div class="details_wrapp">
    <div class="back-btn">
      <router-link to="/"></router-link>
    </div>

    <ScopePopups />

    <form>
      <div class="details-container" style="display:none;">
        <h2>Roof scoping</h2>
        <div class="scope-details">
          <div class="scope-details-column">
            <div class="details-item name">
              <div class="row-title">Name</div>
              <div>{{ Claim.customer_name }}</div>
            </div>
            <div class="details-item">
              <div class="row-title">Address</div>
              <div>{{ Claim.customer_address1 }}</div>
            </div>
            <div class="details-item">
              <div class="row-title">Phone</div>
              <div>{{ Claim.customer_home_phone }}</div>
            </div>
          </div>
          <div class="scope-details-column">
            <div class="details-item job">
              <div class="row-title">Job site type</div>
              <div>Residential</div>
            </div>
            <div class="details-item">
              <div class="row-title">Service type</div>
              <div>{{ Claim.service_type }}</div>
            </div>
            <div class="details-item">
              <div class="row-title">Service zone</div>
              <div>Roof</div>
            </div>
          </div>
          <div class="scope-details-column">
            <div class="details-item carrier">
              <div class="row-title">Insurance carrier</div>
              <div>{{ Claim.insurance_name }}</div>
            </div>
            <div class="details-item">
              <div class="row-title">Policy number</div>
              <div>{{ Claim.policy_number }}</div>
            </div>
            <div class="details-item">
              <div class="row-title">Adjuster</div>
              <div>{{ Claim.adjuster_name }}</div>
            </div>
          </div>
          <div class="scope-details-column">
            <div class="details-item date">
              <div class="row-title">Scheduled date</div>
              <div>{{ Claim.expected_submission_date }}</div>
            </div>
            <div class="details-item status">
              <div class="row-title">Status</div>
              <div>{{ Claim.status }}</div>
            </div>
          </div>
        </div>

        <div class="scope-details-row">
          <div class="field-name">Source of loss</div>
          <div>
            <Select2 v-model="DamageType"
                     :options="DamageTypes"
                     :settings="{ width: '580px', minimumResultsForSearch: -1 }" />
          </div>
        </div>
        <div class="details-buttons">
          <button class="start-button">Let's start!</button>
        </div>
      </div>
      <div class="elevations-container">
        <div class="e-details">
          <div class="e-details-column">
            <div class="top">
              <div class="title">Job details</div>
              <div :class='"status " + getStatusClass(Claim)'>{{ getStatusClass(Claim, true) }}</div>
            </div>
            <ul class="info_list">
              <li>
                <div class="name">File number:</div>
                <div class="value">{{ Claim.file_number }}</div>
              </li>
              <li>
                <div class="name">Policy number:</div>
                <div class="value">{{ Claim.policy_number }}</div>
              </li>
              <li>
                <div class="name">Type of loss:</div>
                <div :class='"value ico ico_"+Claim.damage_type.toLowerCase()'>{{ Claim.damage_type }}</div>
              </li>
              <li>
                <div class="name">Claim ID:</div>
                <div class="value">{{ Claim.claim_unique_id }}</div>
              </li>
              <li>
                <div class="name">Site type:</div>
                <div :class='"value ico ico_"+Claim.site_type.toLowerCase()'>{{ Claim.site_type }}</div>
              </li>
              <li>
                <div class="name">Dwelling type:</div>
                <div class="value">{{ Claim.dwelling_title }}</div>
              </li>
              <li>
                <div class="name">Date of loss:</div>
                <div class="value">{{ Claim.date_of_loss }}</div>
              </li>
              <li>
                <div class="name">Claim date:</div>
                <div class="value">{{ Claim.claim_date }}</div>
              </li>
              <li>
                <div class="name">Loss address:</div>
                <div class="value">{{ getAddress(Claim) }}</div>
              </li>
            </ul>
          </div>
          <div class="e-details-column">
            <ul class="content-tabs">
              <li v-for="(tab, index) in tabs" :key="'tab-' + index"
                  @click="currentTab = tab"
                  v-bind:class="[currentTab === tab ? 'selected' : '']">{{ tab }}</li>
            </ul>
            <div class="content-tab-content" v-show="currentTab === 'Insured'">
              <ul class="info_list">
                <li>
                  <div class="name">Name:</div>
                  <div class="value">{{ Claim.customer_firstname }} {{ Claim.customer_lastname }}</div>
                </li>
                <li>
                  <div class="name">Email:</div>
                  <div class="value ico mail">{{ Claim.customer_email }}</div>
                </li>
                <li>
                  <div class="name">Home phone:</div>
                  <div class="value ico phone">{{ Claim.customer_home_phone }}</div>
                </li>
                <li>
                  <div class="name">Cell phone:</div>
                  <div class="value ico cell">{{ Claim.customer_cell_phone }}</div>
                </li>
              </ul>
            </div>
            <div class="content-tab-content" v-show="currentTab === 'Contact person'">
              <ul class="info_list">
                <li>
                  <div class="name">Name:</div>
                  <div class="value">{{ Claim.contact_person_firstname }} {{ Claim.contact_person_lastname }}</div>
                </li>
                <li>
                  <div class="name">Email:</div>
                  <div class="value ico mail">{{ Claim.contact_person_email }}</div>
                </li>
                <li>
                  <div class="name">Cell Phone:</div>
                  <div class="value ico phone">{{ Claim.contact_person_cell_phone }}</div>
                </li>
                <li>
                  <div class="name">Relationship:</div>
                  <div class="value">{{ Claim.relationship_title }}</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="e-details-column">
            <div class="column__title">Insurance carrier</div>
            <ul class="info_list">
              <li>
                <div class="name">Company:</div>
                <div class="value">{{ Claim.insurance_name }}</div>
              </li>
              <li>
                <div class="name">{{ capitalizeFirstLetter(Claim.adjuster_activity_type) }} Adjuster:</div>
                <div class="value">{{ Claim.adjuster_firstname }} {{ Claim.adjuster_lastname }}</div>
              </li>
              <li>
                <div class="name">Office phone:</div>
                <div class="value ico phone">{{ Claim.adjuster_office_phone }}</div>
              </li>
              <li v-if="Claim.adjuster_fax">
                <div class="name">Fax:</div>
                <div class="value ico fax">{{ Claim.adjuster_fax }}</div>
              </li>
            </ul>
          </div>
          <div class="e-details-column">
            <div v-if="Claim.has_independed_adjuster" class="column__title">Independent field adjuster</div>
            <ul v-if="Claim.has_independed_adjuster" class="info_list">
              <li>
                <div class="name">Company:</div>
                <div class="value">{{ Claim.independed_adjuster_company }}</div>
              </li>
              <li>
                <div class="name">Name:</div>
                <div class="value">{{ Claim.independed_adjuster_firstname }} {{ Claim.independed_adjuster_lastname }}</div>
              </li>
              <li>
                <div class="name">Phone:</div>
                <div class="value ico phone">{{ Claim.independed_adjuster_cell_phone }}</div>
              </li>
              <li>
                <div class="name">Email:</div>
                <div class="value ico mail">{{ Claim.independed_adjuster_email }}</div>
              </li>
            </ul>
            <div v-if="Claim.has_public_adjuster" class="column__title second">Public Adjuster</div>
            <ul v-if="Claim.has_public_adjuster" class="info_list">
              <li>
                <div class="name">Company:</div>
                <div class="value">{{ Claim.public_adjuster_company }}</div>
              </li>
              <li>
                <div class="name">Name:</div>
                <div class="value">{{ Claim.public_adjuster_firstname }} {{ Claim.public_adjuster_lastname }}</div>
              </li>
              <li>
                <div class="name">Phone:</div>
                <div class="value ico phone">{{ Claim.public_adjuster_cell_phone }}</div>
              </li>
              <li>
                <div class="name">Email:</div>
                <div class="value ico mail">{{ Claim.public_adjuster_email }}</div>
              </li>
            </ul>
          </div>
        </div>

        <div style="display: none">
          <div class="e_scope__details">
            <div class="e_scope__title">Scope details</div>
            <ul class="info_list">
              <li>
                <div class="name">Scope ID:</div>
                <div class="value">22-12345STI -1</div>
              </li>
              <li>
                <div class="name">Scope status:</div>
                <div class="value ico status">Waiting for approval</div>
              </li>
              <li>
                <div class="name">Service type:</div>
                <div class="value">Construction</div>
              </li>
              <li>
                <div class="name">Scoper:</div>
                <div class="value">Stephanie Sharkey</div>
              </li>
            </ul>
          </div>
          <div class="steps_info">
            <div class="step_title">Milestones:</div>
            <div class="step_info__line">
              <div class="step step_1">
                <div>Initial contact</div>
                <div>06/23/2022</div>
              </div>
              <div class="step step_2">
                <div>Initial contact</div>
                <div>06/23/2022</div>
              </div>
              <div class="step step_3">
                <div>Initial contact</div>
                <div>06/23/2022</div>
              </div>
              <div class="step step_4">
                <div>Initial contact</div>
                <div>06/23/2022</div>
              </div>
              <div class="step step_5">
                <div>Initial contact</div>
                <div>06/23/2022</div>
              </div>
              <div class="step step_6">
                <div>Initial contact</div>
                <div>06/23/2022</div>
              </div>
              <div class="step step_finish">
                <div>Approved</div>
              </div>
            </div>
          </div>
          <div class="details-buttons">
            <button class="start-button">Let's start!</button>
          </div>
        </div>
        <div class="scope-list">
          <div class="initial-contact">
            <strong>Initial contact:</strong>
            {{ formatDate(Claim.initial_contact_datetime) }}
          </div>
          <ScopeList v-bind:claim="Claim" />
        </div>
      </div>
    </form>

  </div>
</template>

<script>
import Select2 from 'vue3-select2-component'
import ScopeList from '@/components/ScopeList'
import ScopePopups from '@/components/ScopePopups'
import moment from 'moment'

export default {
  components: { Select2, ScopeList, ScopePopups },
  data: () => ({
    DamageType: '',
    currentTab: 'Insured',
    tabs: [
      'Insured'
    ]
  }),
  computed: {
    Claim () {
      return this.$store.getters.getCurrentClaim
    }
  },
  mounted () {
    if (this.Claim.has_contact_person) {
      this.tabs.push('Contact person')
    }
  },
  methods: {
    capitalizeFirstLetter (string) {
      return string !== null ? string.charAt(0).toUpperCase() + string.slice(1) : ''
    },
    getStatusClass (claim, pretty = false) {
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
      return pretty ? this.capitalizeFirstLetter(status.replace('-', ' ')) : status
    },
    getAddress (claim) {
      const address = []
      if (claim.loss_address1 && claim.loss_address1 !== '') {
        address.push(claim.loss_address1)
      }
      if (claim.loss_address2 && claim.loss_address2 !== '') {
        address.push(claim.loss_address2)
      }
      if (claim.loss_city && claim.loss_city !== '') {
        address.push(claim.loss_city)
      }
      if (claim.loss_state_code && claim.loss_state_code !== '' && claim.loss_zip && claim.loss_zip !== '') {
        address.push(claim.loss_state_code + ' ' + claim.loss_zip)
      }
      address.push('USA')
      return address.join(', ')
    },
    formatDate (date) {
      if (date && date !== '0000-00-00 00:00:00') {
        return moment(String(date)).format('MM/DD/YYYY hh:mm')
      }
    }
  }
}
</script>
