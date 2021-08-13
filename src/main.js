// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// style normalize
import 'normalize.css'

// VueAwesomeSwiper and require style
import 'swiper/dist/css/swiper.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)

// scrollSpy (IE import path fixed)
import scrollSpy from 'vue2-scrollspy/dist/index'
Vue.use(scrollSpy)

// font-awsome setup
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas, fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)

//ElementUI
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-TW'
import './element-custom.scss'
ElementUI.Select.mixins.push({
    data: () => ({
        addOnNoMatchTextPtr: null
    }),
    methods: {
        filterOptsWhenComposite({ data }) {
            this.hideAddonNoMatchText()
            this.handleQueryChange(`${this.query}${data}`) // composited + compositing Text
            if (!this.filteredOptionsCount && !this.emptyText) {
                this.$refs.scrollbar.$el.classList.add("is-empty")
                this.addOnNoMatchTextPtr.style.display = 'block'
            }
        },
        hideAddonNoMatchText() {
            this.addOnNoMatchTextPtr.style.display = 'none'
        },
        createAddonNoMatchText() {
            const d = document.createElement("p")
            d.classList.add("el-select-dropdown__empty")
            d.innerText = this.t('el.select.noMatch')
            d.style.display = 'none'
            return d
        }
    },
    mounted() {
        /**
         * first word can't caculate "this.emptyText" in el-select
         * addon notmatch text manually
         */
        this.addOnNoMatchTextPtr = this.createAddonNoMatchText()
        this.$refs.popper.$el.appendChild(this.addOnNoMatchTextPtr)
        this.input = this.$refs.reference.$el.querySelector('input')

        this.input.addEventListener("compositionend", this.hideAddonNoMatchText)
        this.input.addEventListener("compositionupdate", this.filterOptsWhenComposite)
    },
    beforeDestory() {
        this.input.removeEventListener("compositionend", this.hideAddonNoMatchText)
        this.input.removeEventListener("compositionupdate", this.filterOptsWhenComposite)
    }
})
Vue.use(ElementUI, { locale })

// VCharts
import VCharts from 'v-charts'
Vue.use(VCharts)

Vue.config.productionTip = false

/**
 * Vuex STATE
 * @CONFIG_API https://vuex.vuejs.org/zh/guide/plugins.html#%E5%86%85%E7%BD%AE-logger-%E6%8F%92%E4%BB%B6
 */
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger' // mutation 及 state change log
const debug = process.env.NODE_ENV !== 'production' // 生產模式: no debug , no strict
const logger = createLogger()
Vue.use(Vuex)

const store = new Vuex.Store({
    strict: debug,
    plugins: debug ? [logger] : []
})

// event bus
Vue.prototype.$EventBus = new Vue()
Vue.prototype.$openLink = (url, traget = "_blank") => window.open(url, traget)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store: store,
    components: { App },
    template: '<App/>',
})