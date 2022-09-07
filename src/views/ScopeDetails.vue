<template>
  <div class="details_wrapp">
    <div class="back-btn">
      <router-link to="/scopes"></router-link>
    </div>

    <form @submit.prevent="StartBuild">
      <div class="details-container" style="display:none;">
        <h2>Roof scoping</h2>
        <div class="scope-details">
          <div class="scope-details-column">
            <div class="details-item name">
              <div class="row-title">Name</div>
              <div>{{ Scope.customer_name }}</div>
            </div>
            <div class="details-item">
              <div class="row-title">Address</div>
              <div>{{ Scope.customer_address1 }}</div>
            </div>
            <div class="details-item">
              <div class="row-title">Phone</div>
              <div>{{ Scope.customer_home_phone }}</div>
            </div>
          </div>
          <div class="scope-details-column">
            <div class="details-item job">
              <div class="row-title">Job site type</div>
              <div>Residential</div>
            </div>
            <div class="details-item">
              <div class="row-title">Service type</div>
              <div>{{ Scope.service_type }}</div>
            </div>
            <div class="details-item">
              <div class="row-title">Service zone</div>
              <div>Roof</div>
            </div>
          </div>
          <div class="scope-details-column">
            <div class="details-item carrier">
              <div class="row-title">Insurance carrier</div>
              <div>{{ Scope.insurance_name }}</div>
            </div>
            <div class="details-item">
              <div class="row-title">Policy number</div>
              <div>{{ Scope.policy_number }}</div>
            </div>
            <div class="details-item">
              <div class="row-title">Adjuster</div>
              <div>{{ Scope.adjuster_name }}</div>
            </div>
          </div>
          <div class="scope-details-column">
            <div class="details-item date">
              <div class="row-title">Scheduled date</div>
              <div>{{ Scope.expected_submission_date }}</div>
            </div>
            <div class="details-item status">
              <div class="row-title">Status</div>
              <div>{{ Scope.status }}</div>
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
              <div class="status">In progress</div>
            </div>
            <ul class="info_list">
              <li>
                <div class="name">File number:</div>
                <div class="value">22-12345STI</div>
              </li>
              <li>
                <div class="name">Policy number:</div>
                <div class="value">DW-38721998</div>
              </li>
              <li>
                <div class="name">Type of loss:</div>
                <div class="value ico ico_hail">Hail</div>
              </li>
              <li>
                <div class="name">Claim ID:</div>
                <div class="value">123456789-024</div>
              </li>
              <li>
                <div class="name">Site type:</div>
                <div class="value ico ico_residental">Residental</div>
              </li>
              <li>
                <div class="name">Dwelling type:</div>
                <div class="value">Apartment</div>
              </li>
              <li>
                <div class="name">Date of loss:</div>
                <div class="value">06/07/2022</div>
              </li>
              <li>
                <div class="name">Claim date:</div>
                <div class="value">06/07/2022</div>
              </li>
              <li>
                <div class="name">Loss address:</div>
                <div class="value">7600 Old Georgetown Rd, Bethesda, MD 20814, USA</div>
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
                  <div class="value">Laura George</div>
                </li>
                <li>
                  <div class="name">Email:</div>
                  <div class="value ico mail">laura.george@company.com</div>
                </li>
                <li>
                  <div class="name">Home phone:</div>
                  <div class="value ico phone">(301) 580-7410</div>
                </li>
                <li>
                  <div class="name">Cell phone:</div>
                  <div class="value ico cell">(813) 752-5611</div>
                </li>
              </ul>
            </div>
            <div class="content-tab-content" v-show="currentTab === 'Contact person'">

            </div>
          </div>
          <div class="e-details-column">
            <div class="column__title">Insurance carrier</div>
            <ul class="info_list">
              <li>
                <div class="name">Company:</div>
                <div class="value">Apple Inc.</div>
              </li>
              <li>
                <div class="name">Desk Adjuster:</div>
                <div class="value ico mail">Ronald Paymer</div>
              </li>
              <li>
                <div class="name">Office phone:</div>
                <div class="value ico phone">(301) 580-7410</div>
              </li>
              <li>
                <div class="name">Fax:</div>
                <div class="value ico fax">(708) 813-8989</div>
              </li>
            </ul>
          </div>
          <div class="e-details-column">
            <div class="column__title">Independent field adjuster</div>
            <ul class="info_list">
              <li>
                <div class="name">Company:</div>
                <div class="value">Apple Inc.</div>
              </li>
              <li>
                <div class="name">Desk Adjuster:</div>
                <div class="value ico mail">Ronald Paymer</div>
              </li>
              <li>
                <div class="name">Office phone:</div>
                <div class="value ico phone">(301) 580-7410</div>
              </li>
              <li>
                <div class="name">Fax:</div>
                <div class="value ico fax">(708) 813-8989</div>
              </li>
            </ul>
            <div class="column__title second">Insurance carrier</div>
            <ul class="info_list">
              <li>
                <div class="name">Company:</div>
                <div class="value">Apple Inc.</div>
              </li>
              <li>
                <div class="name">Desk Adjuster:</div>
                <div class="value ico mail">Ronald Paymer</div>
              </li>
              <li>
                <div class="name">Office phone:</div>
                <div class="value ico phone">(301) 580-7410</div>
              </li>
              <li>
                <div class="name">Fax:</div>
                <div class="value ico fax">(708) 813-8989</div>
              </li>
            </ul>
          </div>
        </div>

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
    </form>

  </div>
</template>

<script>
import Select2 from 'vue3-select2-component'

export default {
  components: { Select2 },
  data: () => ({
    DamageType: '',
    currentTab: 'Insured',
    tabs: [
      'Insured', 'Contact person'
    ]
  }),
  computed: {
    Scope () {
      return this.$store.getters.getCurrentScope
    },
    DamageTypes () {
      const list = [
        { id: '0', text: 'All' }
      ]
      this.$store.getters.getDamageTypes.forEach((action) => {
        list.push(
          { id: action.code, text: action.title }
        )
      })
      return list
    },
    getScopeDamageType () {
      let code = ''
      if (this.Scope.damage_type_id !== undefined) {
        const Damage = this.$store.getters.getDamageTypes.find(
          item => item.id === (1 * this.Scope.damage_type_id)
        )
        code = Damage !== undefined && Damage.code !== undefined ? Damage.code : ''
      }
      return code
    }
  },
  mounted () {
    this.DamageType = this.getScopeDamageType
  },
  methods: {
    StartBuild () {
      this.$store.dispatch('resetMenu')
      this.$router.push('/ScopeBuild')
    }
  }
}
</script>
