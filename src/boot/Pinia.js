import { pinia } from '../stores/index'

export default ({ app, router, store }) => {
  app.use(pinia)
}