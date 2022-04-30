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
    title: process.env.SERVER_NAME,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover' },
      { hid: 'description', name: 'description', content: process.env.SERVER_MODT }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    script: [
      { src: '/leaflet.js' },
      { src: '/mapc.js' }
    ]
  },

  publicRuntimeConfig: {
    serverUrl: process.env.SERVER_URL || 'rea.lity.cc',
    serverName: process.env.SERVER_NAME || 'creaftOS',
    serverNameShort: process.env.SERVER_NAME_SHORT || 'cOS',
    serverDescription: process.env.SERVER_MODT || 'Our World is a Simulation',
    serverDescriptionLong: process.env.SERVER_DESCRIPTION || 'This Minecraft Server blows your mind. Try it out! It\'s free and open source.',
  },
  //
  // env: {
  //   serverName: process.env.SERVER_NAME || 'creaftOS',
  //   serverNameShort: process.env.SERVER_NAME_SHORT || 'creaftOS',
  //   serverDescription: process.env.SERVER_DESCRIPTION || 'Our World is a Simulation',
  //   serverDescriptionShort: process.env.SERVER_DESCRIPTION || 'Our World is a Simulation',
  // },

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
    // prefix: '/api/',
    baseURL: 'http://localhost:3000/api'
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

  pwa: {
    manifest: {
      name: process.env.SERVER_NAME,
      short_name: process.env.SERVER_NAME,
      lang: 'en',
      useWebmanifestExtension: false,
      display: 'standalone',
    },
    meta: {
      name: process.env.SERVER_NAME,
      description: process.env.SERVER_MODT,
      viewport:
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover',
      mobileAppIOS: true,
      appleStatusBarStyle: 'black-translucent',
    },
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
