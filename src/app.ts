import express from 'express'
import cors from 'cors'
import route from './route'

const app = express()

app.use(express.json())
app.use(cors())
//app.use(route)

app.listen(3000, ()=>{
    console.log('Servidor rodando na porta 3000')
})

export default app