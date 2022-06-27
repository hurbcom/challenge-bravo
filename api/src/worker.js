const cron = require('node-cron')
const { updateCurrenciesJob } = require('./jobs/updateCurrenciesJob')

// Returns a function that calls 'fn' inside a try..catch to log possible errors.
// For some reason, jobs run inside cron do not log errors. So, this is necessary.
const logErrors = (fn) => {
  return () => {
    try {
      fn()
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

// Run update job every 10 minutes
// cron.schedule('*/10 * * * *', logErrors(updateCurrenciesJob.execute))
cron.schedule('*/10 * * * * *', logErrors(updateCurrenciesJob.execute))
