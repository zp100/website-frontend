import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleRight, faSquareCaretLeft, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

library.add(faCircleRight, faSquareCaretLeft, faTrashCan)

const app = createApp(App)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
