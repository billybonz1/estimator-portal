export default {
  install (Vue, options = []) {
    Vue.config.globalProperties.$notify = function (html) {
      console.log(html)
    }

    Vue.config.globalProperties.$notifyError = function (html) {
      console.log(html)
    }
  }
}
