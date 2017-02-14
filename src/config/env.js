/* eslint-disable no-console */

process.on('SIGINT', function () {
  console.log('got SIGINT, exiting')
  process.exit()
})

process.on('SIGTERM', function () {
  console.log('got SIGTERM, exiting')
  process.exit()
})

process.env.TMPDIR = '/tmp'

/* eslint-enable no-console */
