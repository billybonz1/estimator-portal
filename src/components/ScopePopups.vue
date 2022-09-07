<template>
  <div class="migration-popup popup" :class="{opened: openedPopup === 'mitigation'}">
    <div>
      <h3>Add mitigation</h3>
      <div class="popup-checkboxes">
        <div class="check_wr" style="width: 30%;">
          <div class="box-clip" v-if="this.getCurrentUser.skills.indexOf('1') > -1">
            <input  id="check_1" class="cust-checkbox" type="checkbox" v-model="popup.data.types.interior"/>
            <label for="check_1">
              <svg>
                <use xlink:href="#checkmark"></use>
              </svg>
              <span>Interior</span>
            </label>
          </div>
        </div>
        <div class="check_wr" style="width: 30%;">
          <div class="box-clip" v-if="this.getCurrentUser.skills.indexOf('2') > -1">
            <input  id="check_2" class="cust-checkbox" type="checkbox" v-model="popup.data.types.contents"/>
            <label for="check_2">
              <svg>
                <use xlink:href="#checkmark"></use>
              </svg>
              <span>Contents</span>
            </label>
          </div>
        </div>
      </div>
      <div class="popup-datepickers">
        <div class="field">
          <div class="lebel">Scheduled date*</div>
          <div class="date_field">
            <input type="date" v-model="popup.data.scheduled_date" style="width:214px">
          </div>
        </div>
        <div class="field">
          <div class="lebel">Due date*</div>
          <div class="date_field">
            <input type="date" :readonly="popup.data.scheduled_date === ''" v-model="popup.data.due_date" :min="popup.data.scheduled_date" style="width:214px">
          </div>
        </div>
      </div>
      <div class="field">
        <div class="lebel">Notes</div>
        <div>
          <textarea v-model="popup.data.notes" id="notes"></textarea>
        </div>
      </div>
      <button class="save-button" v-bind:class="[(popup.data.types.contents || popup.data.types.interior) && popup.data.scheduled_date !== '' && popup.data.due_date !== '' ? '' : 'disabled']" @click="save()">Save</button>
      <div class="close" @click="closePopup()">Close</div>
    </div>
  </div>
  <div class="construction-popup popup" :class="{opened: openedPopup === 'construction'}">
    <div>
      <h3>Add construction</h3>
      <div class="popup-checkboxes">
        <div class="check_wr" style="width: 30%; margin-bottom: 25px;">
          <div class="box-clip">
            <input  id="check_3" class="cust-checkbox" type="checkbox" v-model="popup.data.types.roofing"/>
            <label for="check_3">
              <svg>
                <use xlink:href="#checkmark"></use>
              </svg>
              <span>Roofing</span>
            </label>
          </div>
        </div>
        <div class="check_wr" style="margin-bottom: 25px;">
          <div class="box-clip">
            <input  id="check_4" class="cust-checkbox" type="checkbox" v-model="popup.data.types.interior_structure"/>
            <label for="check_4">
              <svg>
                <use xlink:href="#checkmark"></use>
              </svg>
              <span>Interior structure</span>
            </label>
          </div>
        </div>
        <div class="check_wr" style="width: 30%;">
          <div class="box-clip">
            <input  id="check_5" class="cust-checkbox" type="checkbox" v-model="popup.data.types.elevations"/>
            <label for="check_5">
              <svg>
                <use xlink:href="#checkmark"></use>
              </svg>
              <span>Elevations</span>
            </label>
          </div>
        </div>
        <div class="check_wr">
          <div class="box-clip">
            <input  id="check_6" class="cust-checkbox" type="checkbox" v-model="popup.data.types.other_structures"/>
            <label for="check_6">
              <svg>
                <use xlink:href="#checkmark"></use>
              </svg>
              <span>Other structures</span>
            </label>
          </div>
        </div>
      </div>
      <div class="popup-datepickers">
        <div class="field">
          <div class="lebel">Scheduled date*</div>
          <div class="date_field">
            <input type="date" v-model="popup.data.scheduled_date" style="width:214px">
          </div>
        </div>
        <div class="field">
          <div class="lebel">Due date*</div>
          <div class="date_field">
            <input type="date" :readonly="popup.data.scheduled_date === ''" v-model="popup.data.due_date" :min="popup.data.scheduled_date" style="width:214px">
          </div>
        </div>
      </div>
      <div class="field">
        <div class="lebel">Notes</div>
        <div>
          <textarea v-model="popup.data.notes" id="cnotes"></textarea>
        </div>
      </div>
      <button class="save-button" v-bind:class="[(popup.data.types.roofing || popup.data.types.interior_structure || popup.data.types.elevations || popup.data.types.other_structures) && popup.data.scheduled_date !== '' && popup.data.due_date !== '' ? '' : 'disabled']" @click="save()">Save</button>
      <div class="close" @click="closePopup()">Close</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  computed: {
    getCurrentUser () {
      const user = this.$store.getters.getCurrentUser
      if (!Array.isArray(user.skills)) {
        user.skills = []
      }
      return user
    },
    openedPopup () {
      return this.$store.getters.getPopup.opened
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
    closePopup () {
      this.$store.dispatch('closePopup')
      this.popup = {
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
    },
    save () {
      this.popup.data.damage_type_id = this.$store.getters.getPopup.data.damage_type_id
      this.popup.data.user_id = this.$store.getters.getPopup.data.user_id
      this.popup.data.claim_id = this.$store.getters.getPopup.data.claim_id
      this.$store.dispatch('saveScopes', { data: this.popup }).then(() => {
        this.popup = {
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
        this.$store.dispatch('closePopup')
      })
    }
  }
}
</script>
