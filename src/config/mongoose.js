import mongoose from 'mongoose'
import { dataBaseUrl, dataBaseConfig } from './index.js'

mongoose
    .connect(dataBaseUrl, dataBaseConfig)
    .then(console.log('Database connected'))
    .catch(err => {
        console.error('Error database >> ', err)
        process.exit(1)
    })

export default mongoose
