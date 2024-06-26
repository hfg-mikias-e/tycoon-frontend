// vue.config.js
module.exports = {
  pwa: {
    name: "TYCOONline",
    themeColor: "#260707",
    start_url :"/",
    display: "standalone",
    orientation:  "landscape",
    handle_links: "preferred",
    launch_handler: {
      client_mode: "navigate-existing"
    }
  },
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
