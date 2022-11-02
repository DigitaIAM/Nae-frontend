import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

export default ({ app, router, store }) => {
  TimeAgo.addDefaultLocale(en)
}