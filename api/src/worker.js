const cron = require('node-cron')
const { updateCurrenciesJob } = require('./jobs/updateCurrenciesJob')

// Run update job every 10 minutes
cron.schedule('*/10 * * * *', updateCurrenciesJob.execute)
