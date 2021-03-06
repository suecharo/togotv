import axios from "axios";
import ja from "./static/json/ja.json"
import en from "./static/json/en.json"

export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s | 統合TV",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "favicon.ico" }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["normalize.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: "~/plugins/infiniteloading", ssr: false }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxt/typescript-build",
    // Doc: https://github.com/nuxt-community/stylelint-module
    "@nuxtjs/stylelint-module",
    "@nuxtjs/style-resources",
  ],
  styleResources: {
    sass: ["~/assets/sass/mixin.sass"],
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      'nuxt-i18n',
      {
        locales: ['en', 'ja'],
        defaultLocale: 'ja',
        vueI18n: {
          fallbackLocale: 'ja',
          messages: {
            en: en,
            ja: ja
          }
        }
      }
    ]
  ],
  /*
   ** Build configuration
   */
  generate: {
    dir: "togotv",
    async routes() {
      let generates = [];
      await axios
        .get(`http://togotv-api.bhx.jp/api/entries?rows=10000`)
        .then((data) => {
          data.data.data.forEach((entry) => {
            generates.push({
              route: entry.uploadDate.replace(/-/g, ""),
              payload: entry,
            });
          });
        })
        .catch((error) => {
          console.log("error", error);
        });

      await axios
        .get(`http://togotv-api.bhx.jp/api/entries?target=pictures&rows=10000`)
        .then((data) => {
          data.data.data.forEach((pic) => {
            generates.push({
              route: pic.id.split("/").pop(),
              payload: pic,
            });
          });
        })
        .catch((error) => {
          console.log("error", error);
        });

      await axios
        .get(
          `http://togotv-api.bhx.jp/api/entries?target=ajacs-training&rows=10000`
        )
        .then((data) => {
          data.data.data.forEach((ajacs) => {
            generates.push({
              route: ajacs.id
                .split("/")
                .pop()
                .replace(/\./g, ""),
              payload: ajacs,
            });
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
      console.log(generates);
      return generates;
    },
    subFolders: false,
  },
  router: {
    base: "/",
    // base: process.env.NODE_ENV === "dev" ? "/" : "/dbcls/togotv/",
    extendRoutes(routes, resolve) {
      routes.forEach((route) => {
        if (route.name === "video") {
          route.path = "/:video(\\d+)";
        } else if (route.name === "picture") {
          route.path = "/:picture(togopic\\.\\d+\\.\\d+)";
        } else if (route.name === "ajacs") {
          route.path = "/:ajacs(ajacs\\d+)";
        }
      });
      const aliases = routes.map(route => ({
        path     : /\/$/.test(route.path) ? `${route.path}index.html` : `${route.path}.html`,
        alias    : route.path,
        component: route.component
      }))
      routes.push(...aliases)
    },
    build: {
      /*
       ** You can extend webpack config here
       */
      extend(config, { isClient }) {
        if (isClient) {
          config.devtool = "source-map";
        }
      },
    },
  },
  hooks: {
    generate: {
      async extendRoutes(routes) {
        const filtered = routes.filter(page => !/\.html$/.test(page.route))
        routes.splice(0, routes.length, ...filtered)
      }
    }
  }
};
