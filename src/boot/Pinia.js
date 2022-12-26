import { pinia } from '../stores/index'
import { api } from '../feathers'

import { useOid } from 'src/stores/oid';

export default ({ app, router, store }) => {
  app.use(pinia);

  api.reAuthenticate()
  .then((msg) => {
    console.log('show application page', msg)

    const oids = msg.user?.oids || []
    const { setOid } = useOid()
    setOid(oids)

  })
  .catch((e) => {
    console.log('show login page', e)
    setTimeout(() => { router.push('/login') }, 50)
  });
}