import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleChevronRight, faDeleteLeft, faShuffle, faSpinner, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

library.add(faCircleChevronRight, faDeleteLeft, faShuffle, faSpinner, faTrashCan)

const app = createApp(App)
app.use(router)
app.mount('#app')
