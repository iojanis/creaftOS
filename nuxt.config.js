/* eslint-disable no-unused-vars */
const pkg = require('./package')

// eslint-disable-next-line no-undef
module.exports = {
  telemetry: false,
  ssr: true,
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      { src: '/leaflet.js' },
      { src: '/mapc.js' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ffbb32' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/semantic/dist/semantic.min.css',
    '~/assets/main.css',
    '~/assets/leaflet.css',
    { src: '~/assets/transitions/vue2-animate.less', lang: 'less' }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '@/plugins/vue-socket.js',
      ssr: false
    }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth',
    ['semantic-ui-vue/nuxt', { css: false }]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    prefix: '/api/',
    baseURL: 'api'
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/local', method: 'post', propertyName: 'token' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/users/me', method: 'get', propertyName: false }
        },
        tokenRequired: true,
        tokenType: 'bearer'
      }
    }
  },
  router: {
    middleware: ['auth']
  },

  buildModules: [
    '@nuxt/postcss8'
    // ...
  ],
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {}
      }
    }
    // extend(config, ctx) {
    //   if (ctx.isDev && ctx.isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // }
  }
}
