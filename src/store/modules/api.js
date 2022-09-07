import axios from 'axios'

export default {
  state: {

  },
  actions: {
    async ApiCall (context, data = {}) {
      let result = {}
      const formData = new FormData()
      formData.append('jsonrpc', '2.0')
      formData.append('id', null)
      formData.append('method', data.model + '::' + data.method)
      for (const [key, value] of Object.entries(data.params)) {
        if (typeof value === 'object') {
          for (const [k, v] of Object.entries(value)) {
            formData.append('params[' + key + '][' + k + ']', v)
          }
        } else {
          formData.append('params[' + key + ']', value)
        }
      }
      const endpoint = this.state.mode === 'production' ? this.state.apiURL_production : this.state.apiURL
      await axios.post(
        endpoint,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then((response) => {
        if (response.data.Exception !== undefined && response.data.error.message !== undefined) {
          throw new Error(response.data.error.message)
        }
        result = response.data.result
      }).catch(error => {
        console.error('axios error!', error)
      })
      return result
    }
  }
}
